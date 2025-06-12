import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {EventService} from "../../services/event.service";
import {EventInfo} from "../../models/event-info.model";
import {EventBasicAttendanceInfo} from "../../../attendance/models/event-basic-attendance-info.model";
import {ConfirmationService} from "../../../attendance/services/confirmation.service";
import {EventFormComponent} from "../event-form/event-form.component";
import {noop, Subscription} from "rxjs";
import {EventStatusService} from "../../services/event-status.service";
import {SkeletonModule} from 'primeng/skeleton';
import {Button} from 'primeng/button';
import {DatePipe, NgTemplateOutlet} from '@angular/common';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DateUtils} from "../../../../shared/util/date-utils";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserScout} from "../../../users/models/user-profile.model";
import {RouterLink} from "@angular/router";
import {TooltipModule} from "primeng/tooltip";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {environment} from "../../../../../environments/environment";
import {UserRole} from "../../../users/models/role.model";

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
  imports: [
    DatePipe,
    SkeletonModule,
    BasicLoadingInfoComponent,
    TooltipModule,
    Button,
    RouterLink,
    NgTemplateOutlet
  ]
})
export class EventInfoComponent implements OnInit, OnDestroy {

  private readonly config = inject(DynamicDialogConfig);
  private readonly eventService = inject(EventService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly eventStatusService = inject(EventStatusService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  protected ref = inject(DynamicDialogRef);

  protected event!: EventInfo;
  protected scoutConfirmations: EventBasicAttendanceInfo[] = [];
  protected userCanEditEvent = false;
  protected userScoutsInEvent: UserScout[] = [];
  private subscription!: Subscription;
  protected copied = false;

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

  private buildEventData(event: EventInfo) {
    this.config.header = `Actividad - ${event.title}`;
    this.userCanEditEvent = this.scouterCanEditEvent(event);
    event.startDate = this.getEventDate(event.startDate, event.unknownTime);
    event.endDate = this.getEventDate(event.endDate, event.unknownTime);
    this.buildAttendance(event);
    this.event = event;
  }

  private scouterCanEditEvent(event: EventInfo) {
    const userIsScouter = this.loggedUserData.hasRequiredPermission(UserRole.SCOUTER);
    return userIsScouter && (event.forEveryone || event.group?.id === this.loggedUserData.getScouterGroup()?.id );
  }

  private getEventDate(date: Date, unknownTime: boolean) {
    return unknownTime ?
      DateUtils.shiftDateToUTC(date) :
      new Date(date);
  }

  private buildAttendance(data: EventInfo) {
    const userHasUserRole = this.loggedUserData.hasRequiredPermission(UserRole.USER);

    if (userHasUserRole && data.hasAttendance) {
      this.userScoutsInEvent = this.loggedUserData.getScouts()
        .filter(scout => scout.group.id === data.group?.id)
        .sort((a, b) => a.name.localeCompare(b.name));

      this.confirmationService.getEventBasicAttendanceInfo(data.id).subscribe(data =>
        this.scoutConfirmations = data.sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      this.userScoutsInEvent = [];
      this.scoutConfirmations = [];
    }
  }

  protected openEditDialog() {
    const editRef = this.dialogService.openDialog(EventFormComponent, 'Editar Actividad', 'small', {id: this.event.id});
    editRef.onClose.subscribe(close => close ? this.ref.close() : noop());
  }

  protected copyEventLink() {
    this.copied = true;
    const link = `${environment.webUrl}/calendario?actividad=${this.event.id}`;
    navigator.clipboard.writeText(link).then(
      () => setTimeout(() => this.copied = false, 6000)
    );
  }
}
