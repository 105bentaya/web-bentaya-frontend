import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {EventService} from "../../services/event.service";
import {ScoutEvent} from "../../models/scout-event.model";
import {EventBasicAttendanceInfo} from "../../../attendance/models/event-basic-attendance-info.model";
import {ConfirmationService} from "../../../attendance/services/confirmation.service";
import {EventFormComponent} from "../event-form/event-form.component";
import {noop, Subscription} from "rxjs";
import {EventStatusService} from "../../services/event-status.service";
import {isNoAttendanceGroup} from "../../../../shared/model/group.model";
import {GroupPipe} from '../../../../shared/pipes/group.pipe';
import {SkeletonModule} from 'primeng/skeleton';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DateUtils} from "../../../../shared/util/date-utils";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserScout} from "../../../../core/auth/user-profile.model";
import {Router} from "@angular/router";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
  imports: [
    DatePipe,
    GroupPipe,
    SkeletonModule,
    BasicLoadingInfoComponent,
    TooltipModule,
    Button
  ]
})
export class EventInfoComponent implements OnInit, OnDestroy {

  private readonly config = inject(DynamicDialogConfig);
  private readonly eventService = inject(EventService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly eventStatusService = inject(EventStatusService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly router = inject(Router);
  protected ref = inject(DynamicDialogRef);

  protected event!: ScoutEvent;
  protected locationLink?: string;
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

  private buildEventData(event: ScoutEvent) {
    this.locationLink = event.latitude && event.longitude ?
      `https://www.google.com/maps/place/${event.latitude},${event.longitude}` :
      undefined;
    this.config.header = `Actividad - ${event.title}`;
    this.userCanEditEvent = this.scouterCanEditEvent(event);
    event.startDate = this.getEventDate(event.startDate, event.unknownTime);
    event.endDate = this.getEventDate(event.endDate, event.unknownTime);
    this.buildAttendance(event);
    this.event = event;
  }

  private scouterCanEditEvent(event: ScoutEvent) {
    return this.loggedUserData.hasRequiredPermission(["ROLE_SCOUTER"]) &&
      (
        event.groupId == this.loggedUserData.getGroupId() ||
        isNoAttendanceGroup(event.groupId)
      );
  }

  getEventDate(date: Date, unknownTime: boolean) {
    return unknownTime ?
      DateUtils.shiftDateToUTC(date) :
      new Date(date);
  }

  private buildAttendance(data: ScoutEvent) {
    const userHasUserRole = this.loggedUserData.hasRequiredPermission(["ROLE_USER"]);

    if (userHasUserRole && data.hasAttendance) {
      this.userScoutsInEvent = this.loggedUserData.getScouts()
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

  protected async navigateToAttendance(event: ScoutEvent) {
    // await this.router.navigate(this.route.snapshot.url.map(url => url.path), {queryParams: {actividad: event.id}, replaceUrl: true});
    this.router.navigate(['/unidad/asistencias'], {queryParams: {actividad: event.id}}).then(() => this.ref.close());
  }

  protected copyEventLink() {
    this.copied = true;
    //todo: do not use location, use new property WB-240
    const link = `${location.origin}/calendario?actividad=${this.event.id}`;
    navigator.clipboard.writeText(link).then(
      () => setTimeout(() => this.copied = false, 6000)
    );
  }
}
