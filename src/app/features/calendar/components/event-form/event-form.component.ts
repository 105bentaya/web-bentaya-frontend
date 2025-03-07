import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {EventService} from "../../services/event.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {EventForm} from "../../models/event-form.model";
import {ConfirmationService} from "primeng/api";
import {EventStatusService} from "../../services/event-status.service";
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {DateUtils} from "../../../../shared/util/date-utils";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {FormHelper} from "../../../../shared/util/form-helper";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {DatePicker} from "primeng/datepicker";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {
  RadioButtonContainerComponent
} from "../../../../shared/components/radio-button-container/radio-button-container.component";
import {RadioButton} from "primeng/radiobutton";
import {Panel} from "primeng/panel";
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {Message} from "primeng/message";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    SelectModule,
    FormTextAreaComponent,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    SaveButtonsComponent,
    InputTextModule,
    BasicLoadingInfoComponent,
    DatePicker,
    CheckboxContainerComponent,
    RadioButtonContainerComponent,
    RadioButton,
    Panel,
    Message
  ]
})
export class EventFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly eventService = inject(EventService);
  private readonly alertService = inject(AlertService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly eventStatusService = inject(EventStatusService);

  protected existingEvent!: EventForm;
  protected formHelper = new FormHelper();
  protected groups: { name: string, id: number }[];
  protected defaultStartDate!: Date;
  protected defaultEndDate!: Date;
  protected saveLoading = false;
  protected deleteLoading = false;
  protected dateCoincidences: BasicGroupInfo[] = [];

  constructor() {
    this.groups = [{id: 0, name: "GRUPO"}];
    const scouterGroup = this.loggedUserData.getGroup();
    if (scouterGroup) this.groups = [{id: scouterGroup.id, name: scouterGroup.name.toUpperCase()}].concat(this.groups);
  }

  ngOnInit(): void {
    const defaultDate = this.config.data?.calendarDate ?? new Date();
    this.defaultStartDate = DateUtils.dateTruncatedToDay(defaultDate, 11);
    this.defaultEndDate = DateUtils.dateTruncatedToDay(defaultDate, 13);
    if (this.config.data?.id) {
      this.eventService.getFormById(this.config.data.id).subscribe({
        next: data => {
          this.existingEvent = data;
          this.initForm(this.existingEvent);
        },
        error: () => this.ref.close()
      });
    } else {
      this.initForm();
    }
  }

  private initForm(event?: EventForm) {
    const specifyLocations = !!event?.meetingLocation || !!event?.pickupLocation;
    this.formHelper.createForm({
      title: [event?.title, Validators.required],
      description: [event?.description, Validators.maxLength(4095)],
      location: [event?.location],
      meetingLocation: [event?.meetingLocation, this.locationValidator],
      pickupLocation: [event?.pickupLocation, this.locationValidator],
      groupId: [this.getGroupId(event), Validators.required],
      forScouters: [event?.forScouters ?? false, Validators.required],
      startDate: [event ? this.getEventStartDate(event) : null, Validators.required],
      endDate: [event ? this.getEventEndDate(event) : null, Validators.required],
      specifyLocations: [specifyLocations ?? false],
      unknownTime: [event?.unknownTime ?? false],
      activateAttendanceList: [event?.activateAttendanceList ?? false],
      closeAttendanceMode: [this.getAttendanceMode(event)],
      closeDateTime: [event?.closeDateTime ? new Date(event.closeDateTime) : null],
      activateAttendancePayment: [event?.activateAttendancePayment ?? false],
    }, {
      validators: [this.datesValidator, this.eventIsClosedValidator]
    });
    if (event && !event.unknownTime) this.getDateConflicts(event.startDate, event.endDate, event.groupId);
  }

  private getDateConflicts(startDate: Date, endDate: Date, groupId?: number) {
    this.eventService.checkForDateConflicts(
      new Date(startDate).toISOString(),
      new Date(endDate).toISOString(),
      groupId
    ).subscribe(res => this.dateCoincidences = res);
  }

  private getGroupId(event?: EventForm) {
    if (!event) return null;
    if (event.groupId) return event.groupId;
    return 0;
  }

  private getAttendanceMode(event?: EventForm) {
    if (event?.closeAttendanceList === true) return "now";
    if (event?.closeDateTime) return "date";
    return "end";
  }

  private getEventStartDate(event: EventForm) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(event.startDate) :
      new Date(event.startDate);
  }

  private getEventEndDate(event: EventForm) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(event.endDate) :
      new Date(event.endDate);
  }

  private readonly datesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let startDate = control.get('startDate')?.value;
    let endDate = control.get('endDate')?.value;
    if (!startDate || !endDate) return null;
    if (control.get('unknownTime')?.value) {
      startDate = new Date(DateUtils.toLocalDate(startDate));
      endDate = new Date(DateUtils.toLocalDate(endDate));
      endDate.setMinutes(1);
    }
    return startDate >= endDate ? {endDateBefore: true} : null;
  };

  private readonly locationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const specifyLocationActivated = this.formHelper.get('specifyLocations')?.value;
    return (!specifyLocationActivated || control.value) ? null : {locationNeeded: true};
  };

  private readonly eventIsClosedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const attendanceIsActive = control.get('activateAttendanceList')?.value === true && control.get('groupId')?.value !== 0 && control.get('forScouters')?.value === false;
    if (attendanceIsActive && control.get('closeAttendanceMode')?.value === 'date') {
      const closeDate = control.get('closeDateTime')?.value;
      if (!closeDate) return {closeDateNeeded: true};
    }
    return null;
  };

  protected onSubmit() {
    this.formHelper.validateAll();
    const event: EventForm = {...this.formHelper.value};
    if (this.formHelper.valid) {
      event.forEveryone = event.groupId == 0;
      if (event.forEveryone) event.groupId = undefined;

      if (event.unknownTime) {
        event.localStartDate = DateUtils.toLocalDate(event.startDate);
        event.localEndDate = DateUtils.toLocalDate(event.endDate);
      }

      if (!event.location || !this.formHelper.controlValue("specifyLocations")) {
        event.meetingLocation = undefined;
        event.pickupLocation = undefined;
      }

      if (!event.activateAttendanceList || event.forScouters || event.forEveryone) {
        event.activateAttendanceList = false;
        event.closeAttendanceList = false;
        event.closeDateTime = undefined;
      }

      if (event.activateAttendanceList) {
        const selectedMode = this.formHelper.controlValue("closeAttendanceMode");
        event.closeAttendanceList = selectedMode === "now";
        if (selectedMode !== "date") event.closeDateTime = undefined;
      }

      this.checkForInfoMessages(event);
    }
  }

  private checkForInfoMessages(event: EventForm) {
    let attendanceOffWarn = false;
    let paymentOffWarn = false;
    if (this.existingEvent) {
      attendanceOffWarn = this.existingEvent.activateAttendanceList != event.activateAttendanceList && !event.activateAttendanceList;
      paymentOffWarn = this.existingEvent.activateAttendancePayment != event.activateAttendancePayment && !event.activateAttendancePayment;
    }

    const eventClosedWarn = this.eventCloseEndDate(event);

    if (attendanceOffWarn || paymentOffWarn || eventClosedWarn) {
      let message = '¿Desea actualizar este evento? ';
      if (attendanceOffWarn) {
        message += `Esta acción eliminará la lista de asistencia asociada${this.existingEvent.activateAttendancePayment ? ' y lo pagos asociados a esta actividad.' : '.'} `;
      } else if (paymentOffWarn) {
        message += "Esta acción eliminará los pagos asociados a esta actividad. ";
      }
      if (eventClosedWarn) {
        message += "La fecha de cierre de la asistencia es posterior a la fecha de fin de la actividad, por lo que los usuarios podrán seguir editando la asistencia tras finalizar la actividad.";
      }
      this.confirmationService.confirm({
        message,
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.saveOrUpdate(event)
      });
    } else {
      this.saveOrUpdate(event);
    }
  }

  private eventCloseEndDate(event: EventForm) {
    if (event.closeDateTime) {
      if (this.existingEvent?.closeDateTime) {
        const oldTime = new Date(this.existingEvent.closeDateTime).toISOString();
        const newTime = new Date(event.closeDateTime).toISOString();
        if (oldTime === newTime) return false;
      }
      const endDate = event.unknownTime ? DateUtils.dateAtLastSecondOfDay(event.endDate) : event.endDate;
      return event.closeDateTime.toISOString() > endDate.toISOString();
    }
    return false;
  }

  private saveOrUpdate(event: EventForm) {
    if (this.existingEvent) {
      event.id = this.existingEvent.id;
      this.update(event);
    } else {
      this.save(event);
    }
  }

  private save(event: EventForm) {
    this.saveLoading = true;
    this.eventService.save(event).subscribe({
      next: result => {
        this.alertService.sendBasicSuccessMessage("Éxisto al crear el evento");
        this.eventStatusService.addEvent(result);
        this.ref.close();
      },
      error: () => this.saveLoading = false
    });
  }

  private update(event: EventForm) {
    this.saveLoading = true;
    this.eventService.update(event).subscribe({
      next: result => {
        this.alertService.sendBasicSuccessMessage("Éxisto al actualizar el evento");
        this.eventStatusService.updateEvent(result);
        this.ref.close();
      },
      error: () => this.saveLoading = false
    });
  }

  protected confirmDeletion() {
    const message = `¿Desea eliminar esta actividad?${this.existingEvent.activateAttendanceList ? ' La lista de asistencia será eliminada. ' : ' '}Esta acción no se podrá deshacer.`;
    this.confirmationService.confirm({
      message: message,
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteEvent()
    });
  }

  private deleteEvent() {
    this.deleteLoading = true;
    this.eventService.delete(this.existingEvent.id!).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Éxito al borrar");
        this.eventStatusService.deleteEvent(this.existingEvent.id!);
        this.ref.close(true);
      },
      error: () => this.deleteLoading = false
    });
  }

  protected showAttendanceCheckbox(): boolean {
    const groupId = this.formHelper.controlValue('groupId');
    const forScouters = this.formHelper.controlValue('forScouters');
    return groupId && groupId !== 0 && !forScouters;
  }

  protected checkDate(date: "startDate" | "endDate") {
    this.checkForDateConflicts();
    const startDate = this.formHelper.controlValue("startDate");
    const endDate = this.formHelper.controlValue("endDate");

    if (startDate && !endDate && date == "endDate") {
      const newEndDate = new Date(startDate);
      newEndDate.setHours(newEndDate.getHours() + 2);
      this.formHelper.get("endDate").setValue(newEndDate);
    } else if (!startDate && endDate && date == "endDate") {
      const newStartDate = new Date(endDate);
      newStartDate.setHours(newStartDate.getHours() - 2);
      this.formHelper.get("startDate").setValue(newStartDate);
    }
  }

  protected checkForDateConflicts() {
    const startDate = this.formHelper.controlValue('startDate');
    const endDate = this.formHelper.controlValue('endDate');
    const unknownTime = this.formHelper.controlValue('unknownTime');
    const groupId = this.formHelper.controlValue('groupId');

    if (!unknownTime && startDate && endDate) {
      this.getDateConflicts(startDate, endDate, groupId);
    } else {
      this.dateCoincidences = [];
    }
  }
}
