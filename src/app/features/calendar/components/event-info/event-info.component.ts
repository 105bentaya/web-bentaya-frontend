import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {EventService} from "../../services/event.service";
import {ScoutEvent} from "../../models/scout-event.model";
import {EventBasicAttendanceInfo} from "../../../attendance/models/event-basic-attendance-info.model";
import {ConfirmationService} from "../../../attendance/services/confirmation.service";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {LoggedUserInformationService} from "../../../../core/auth/services/logged-user-information.service";
import {Scout} from "../../../scouts/models/scout.model";
import {EventFormComponent} from "../event-form/event-form.component";
import {noop, Subscription} from "rxjs";
import {EventStatusService} from "../../services/event-status.service";
import {isNoAttendanceGroup} from "../../../../shared/model/group.model";
import {GroupPipe} from '../../../../shared/pipes/group.pipe';
import {SkeletonModule} from 'primeng/skeleton';
import {ButtonDirective} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DateUtils} from "../../../../shared/util/date-utils";

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    GroupPipe,
    SkeletonModule,
    BasicLoadingInfoComponent,
    ButtonDirective
  ]
})
export class EventInfoComponent implements OnInit, OnDestroy {

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private eventService = inject(EventService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private eventStatusService = inject(EventStatusService);

  protected event!: ScoutEvent;
  protected locationLink?: string;
  protected scoutConfirmations: EventBasicAttendanceInfo[] = [];
  protected userCanEditEvent = false;
  protected userScoutsInEvent: Scout[] = [];
  private subscription!: Subscription;

  ngOnInit(): void {
    this.eventService.getInfoById(this.config.data).subscribe({
      next: data => this.buildEventData(data),
      error: () => this.ref.close()
    });
    this.subscription = this.eventStatusService.updatedEvent.subscribe(event => this.buildEventData(event));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private buildEventData(event: ScoutEvent) {
    this.locationLink = event.latitude && event.longitude ?
      `https://www.google.com/maps/place/${event.latitude},${event.longitude}` : undefined;
    this.config.header = `Actividad - ${event.title}`;
    this.userCanEditEvent = this.authService.hasRequiredPermission(["ROLE_SCOUTER"]) &&
      (event.groupId == LoggedUserInformationService.getUserInformation().groupId || isNoAttendanceGroup(event.groupId)); //todo auth
    event.startDate = this.getEventDate(event.startDate, event.unknownTime);
    event.endDate = this.getEventDate(event.endDate, event.unknownTime);
    this.buildAttendance(event);
    this.event = event;
  }

  getEventDate(date: Date, unknownTime: boolean) {
    return unknownTime ?
      DateUtils.shiftDateToUTC(date) :
      new Date(date);
  }

  private buildAttendance(data: ScoutEvent) {
    const userHasUserRole = this.authService.hasRequiredPermission(["ROLE_USER"]);

    if (userHasUserRole && data.hasAttendance) {
      this.userScoutsInEvent = LoggedUserInformationService.getUserInformation().scoutList!
        .filter(scout => scout.groupId == data.groupId)
        .sort((a, b) => a.name.localeCompare(b.name));

      this.confirmationService.getEventBasicAttendanceInfo(data.id).subscribe(data =>
        this.scoutConfirmations = data.sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      this.userScoutsInEvent = [];
      this.scoutConfirmations = [];
    }
  }

  protected openEditDialog() {
    const editRef = this.dialogService.open(EventFormComponent, {
      header: 'Editar Actividad',
      styleClass: 'dialog-width',
      data: {id: this.event.id}
    });
    editRef.onClose.subscribe(close => close ? this.ref.close() : noop());
  }
}
