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
import {LoggedUserInformationService} from "../../../../core/auth/services/logged-user-information.service";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {EventStatusService} from "../../services/event-status.service";
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {DateUtils} from "../../../../shared/util/date-utils";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {FormHelper} from "../../../../shared/util/form-helper";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    DropdownModule,
    FormTextAreaComponent,
    CalendarModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    SaveButtonsComponent,
    InputTextModule,
    BasicLoadingInfoComponent
  ]
})
export class EventFormComponent implements OnInit {

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private eventService = inject(EventService);
  private alertService = inject(AlertService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService);
  private eventStatusService = inject(EventStatusService);

  protected existingEvent!: FormEvent;
  protected formHelper = new FormHelper();
  protected groups: { name: string, id: number }[];
  protected defaultStartDate!: Date;
  protected defaultEndDate!: Date;
  protected saveLoading = false;
  protected deleteLoading = false;

  constructor() {
    this.groups = [];
    const groupId = LoggedUserInformationService.getUserInformation().groupId; //todo auth
    if (this.authService.hasRequiredPermission(["ROLE_SCOUTER"])) {
      if (groupId) this.groups.push(groups[groupId]);
      this.groups = this.groups.concat(getGeneralGroups());
    } else if (this.authService.hasRequiredPermission(["ROLE_ADMIN", "ROLE_GROUP_SCOUTER"])) {
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
      description: [event?.description, Validators.required],
      location: [event?.location, Validators.required],
      latitude: [event?.latitude],
      longitude: [event?.longitude],
      groupId: [event?.groupId, Validators.required],
      startDate: [event ? this.getEventStartDate(event) : null, Validators.required],
      endDate: [event ? this.getEventEndDate(event) : null, Validators.required],
      addCoordinates: [addCoordinates ?? false],
      unknownTime: [event?.unknownTime ?? false],
      activateAttendanceList: [event?.activateAttendanceList ?? false],
      closeAttendanceList: [event?.closeAttendanceList ?? false],
      activateAttendancePayment: [event?.activateAttendancePayment ?? false],
    }, {
      validators: [this.datesValidator, this.locationValidator]
    });
  }

  getEventStartDate(event: FormEvent) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(event.startDate) :
      new Date(event.startDate);
  }

  getEventEndDate(event: FormEvent) {
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
      }
      if (this.existingEvent) {
        event.id = this.existingEvent.id;
        this.checkForUpdateMessage(event);
      } else {
        this.save(event);
      }
    }
  }

  private datesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
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

  private locationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.get('addCoordinates')?.value) {
      const latitude = control.get('latitude')?.value;
      const longitude = control.get('longitude')?.value;
      return !(latitude || latitude === 0) || !(longitude || longitude === 0) ? {coordinatesNeeded: true} : null;
    }
    return null;
  };

  private checkForUpdateMessage(event: FormEvent) {
    if (this.existingEvent.activateAttendanceList != event.activateAttendanceList && !event.activateAttendanceList) {
      this.confirmationService.confirm({
        message: '¿Desea actualizar este evento? Esta acción eliminará la lista de asistencia asociada' +
          `${this.existingEvent.activateAttendancePayment ? ' y lo pagos asociados a esta actividad.' : '.'}`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.update(event)
      });
    } else if (this.existingEvent.activateAttendancePayment != event.activateAttendancePayment && !event.activateAttendancePayment) {
      this.confirmationService.confirm({
        message: '¿Desea actualizar este evento? Esta acción eliminará los pagos asociados a esta actividad.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.update(event)
      });
    } else {
      this.update(event);
    }
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

  //todo: improve to update dates when changing date while still selecting it
  protected checkOtherDate() {
    // const startDate = this.formHelper.controlValue("startDate");
    // const endDate = this.formHelper.controlValue("endDate");
    // if (startDate && !endDate) {
    //   const newEndDate = new Date(startDate);
    //   newEndDate.setHours(newEndDate.getHours() + 2);
    //   this.formHelper.get("endDate").setValue(newEndDate);
    // } else if (endDate && !startDate) {
    //   const newStartDate = new Date(endDate);
    //   newStartDate.setHours(newStartDate.getHours() - 2);
    //   this.formHelper.get("startDate").setValue(newStartDate);
    // }
  }
}
