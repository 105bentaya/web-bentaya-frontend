import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {getGeneralGroups, groups, isNoAttendanceGroup} from "../../../../shared/model/group.model";
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
import {FormEvent} from "../../models/form-event.model";
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
    Panel
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

  protected existingEvent!: FormEvent;
  protected formHelper = new FormHelper();
  protected groups: { name: string, id: number }[];
  protected defaultStartDate!: Date;
  protected defaultEndDate!: Date;
  protected saveLoading = false;
  protected deleteLoading = false;

  constructor() {
    this.groups = [];
    const groupId = this.loggedUserData.getGroupId();
    if (this.loggedUserData.hasRequiredPermission(["ROLE_SCOUTER"])) {
      if (groupId) this.groups.push(groups[groupId]);
      this.groups = this.groups.concat(getGeneralGroups());
    } else if (this.loggedUserData.hasRequiredPermission(["ROLE_GROUP_SCOUTER"])) {
      this.groups = getGeneralGroups();
    }
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

  private initForm(event?: FormEvent) {
    const addCoordinates = !!event?.longitude && !!event?.latitude;
    this.formHelper.createForm({
      title: [event?.title, Validators.required],
      description: [event?.description, Validators.maxLength(4095)],
      location: [event?.location],
      latitude: [event?.latitude],
      longitude: [event?.longitude],
      groupId: [event?.groupId, Validators.required],
      startDate: [event ? this.getEventStartDate(event) : null, Validators.required],
      endDate: [event ? this.getEventEndDate(event) : null, Validators.required],
      addCoordinates: [addCoordinates ?? false],
      unknownTime: [event?.unknownTime ?? false],
      activateAttendanceList: [event?.activateAttendanceList ?? false],
      closeAttendanceMode: [this.getAttendanceMode(event)],
      closeDateTime: [event?.closeDateTime ? new Date(event.closeDateTime) : null],
      activateAttendancePayment: [event?.activateAttendancePayment ?? false],
    }, {
      validators: [this.datesValidator, this.locationValidator]
    });
  }

  private getAttendanceMode(event?: FormEvent) {
    if (event?.closeAttendanceList === true) return "now";
    if (event?.closeDateTime) return "date";
    return "end";
  }

  private getEventStartDate(event: FormEvent) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(event.startDate) :
      new Date(event.startDate);
  }

  private getEventEndDate(event: FormEvent) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(event.endDate) :
      new Date(event.endDate);
  }

  protected onSubmit() {
    this.formHelper.validateAll();
    const event: FormEvent = {...this.formHelper.value};
    if (this.formHelper.valid) {
      if (event.unknownTime) {
        event.localStartDate = DateUtils.toLocalDate(event.startDate);
        event.localEndDate = DateUtils.toLocalDate(event.endDate);
      }
      if (isNoAttendanceGroup(event.groupId)) {
        event.activateAttendanceList = false;
        event.closeDateTime = undefined;
      }
      if (event.activateAttendanceList) {
        const selectedMode = this.formHelper.controlValue("closeAttendanceMode");
        event.closeAttendanceList = selectedMode === "now";
        if (selectedMode !== "date") event.closeDateTime = undefined;
      } else {
        event.closeAttendanceList = false;
        event.closeDateTime = undefined;
      }

      this.checkForInfoMessages(event);
    }
  }

  private saveOrUpdate(event: FormEvent) {
    if (this.existingEvent) {
      event.id = this.existingEvent.id;
      this.update(event);
    } else {
      this.save(event);
    }
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
    if (control.get('addCoordinates')?.value) {
      const latitude = control.get('latitude')?.value;
      const longitude = control.get('longitude')?.value;
      return !(latitude || latitude === 0) || !(longitude || longitude === 0) ? {coordinatesNeeded: true} : null;
    }
    return null;
  };

  private checkForInfoMessages(event: FormEvent) {
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
        message += "La fecha de cierre de la asistencia es posterior a la fecha de fin de la actividad, por lo que los usuarios podrán seguir editando la asistencia tras el cierre de esta.";
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

  private eventCloseEndDate(event: FormEvent) {
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

  private save(event: FormEvent) {
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

  private update(event: FormEvent) {
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
    this.confirmationService.confirm({
      message: '¿Desea eliminar esta actividad? Esta acción no se podrá deshacer.',
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
    return groupId && !isNoAttendanceGroup(groupId);
  }

  protected checkDate(date: "startDate" | "endDate") {
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
}
