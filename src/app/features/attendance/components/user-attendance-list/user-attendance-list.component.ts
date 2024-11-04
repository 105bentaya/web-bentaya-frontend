import {Component, inject, OnInit} from '@angular/core';
import {ConfirmationService} from "../../services/confirmation.service";
import {UserListInfo} from "../../models/user-list-info.model";
import {FilterService, MenuItem} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {NotificationService} from "../../../../core/notification/notification.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {EventInfoComponent} from "../../../calendar/components/event-info/event-info.component";
import {TagModule} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {BadgeModule} from 'primeng/badge';
import {TabMenuModule} from 'primeng/tabmenu';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {DatePipe, NgClass} from '@angular/common';
import {ToggleButtonModule} from "primeng/togglebutton";
import {Confirmation} from "../../models/confirmation.model";
import {AttendanceFormComponent} from "../attendance-form/attendance-form.component";
import {DateUtils} from "../../../../shared/util/date-utils";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";

@Component({
  selector: 'app-user-attendance-list',
  templateUrl: './user-attendance-list.component.html',
  styleUrls: ['./user-attendance-list.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    ToggleButtonModule,
    TabMenuModule,
    TableModule,
    BadgeModule,
    NgClass,
    TagModule,
    DatePipe,
    BasicLoadingInfoComponent
  ]
})
export class UserAttendanceListComponent implements OnInit {

  private filterService = inject(FilterService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);

  protected tabMenuItems!: MenuItem[];
  protected info!: UserListInfo[];
  protected selectedScoutIndex = 0;
  protected filterDates!: Date[];
  protected showClosedButton = false;
  private ref!: DynamicDialogRef;
  private yesterday = DateUtils.plusDays(new Date(), -1);

  ngOnInit(): void {
    this.confirmationService.getAllBasicUserInfo().subscribe({
      next: scouts => {
        this.info = scouts.sort((s1, s2) => s1.name.localeCompare(s2.name));
        this.info.forEach(scout => scout.info.sort((e1, e2) => DateUtils.dateSorter(e1.eventStartDate, e2.eventStartDate)));
        this.showClosedButton = scouts.some(scout => scout.info.some(info => info.closed && new Date(info.eventEndDate) <= this.yesterday));
        if (scouts.length > 1) this.generateMenuItems();
        this.registerFilters();
      }
    });
  }

  protected openEditDialog(eventId: number, scoutId: number) {
    this.ref = this.dialogService.open(AttendanceFormComponent, {
      header: 'Asistencia',
      styleClass: 'dialog-width',
      data: {eventId: eventId, scoutId: scoutId}
    });
    this.ref.onClose.subscribe((data: Confirmation) => {
      if (data) {
        const editedScout = this.info.find(scout => scout.scoutId == data.scoutId)!;

        const result = editedScout.info.find(info => info.eventId == data.eventId)!;
        result.attending = data.attending;
        result.payed = data.payed;

        if (this.info.length > 1) {
          this.tabMenuItems.find(item => item.id === scoutId.toString())!.badge = editedScout.info
            .some(info => !info.closed && info.attending == null) ? "1" : undefined;
        }

        if (!this.info.some(scout => scout.info.some(info => !info.closed && info.attending == null))) {
          this.notificationService.userHasNoNotifications();
        }
      }
    });
  }

  protected openInfoDialog(eventId: number) {
    this.ref = this.dialogService.open(EventInfoComponent, {
      header: 'Actividad',
      styleClass: 'small dialog-width',
      data: eventId
    });
  }

  private generateMenuItems() {
    this.tabMenuItems = this.info.map(scout => ({
      label: scout.name,
      badge: scout.info.some(info => !info.closed && info.attending == null) ? "1" : undefined,
      id: scout.scoutId.toString(),
      command: () => this.selectedScoutIndex = this.info.indexOf(scout)
    }));
  }

  private registerFilters() {
    this.filterService.register("past-attendance", (eventEndDate: Date, filterValue: boolean): boolean => {
      if (filterValue === undefined || filterValue === null) return true;
      if (eventEndDate === undefined || eventEndDate === null) return false;
      if (filterValue) return true;
      return new Date(eventEndDate) >= this.yesterday;
    });
    this.filterService.register("date-range", (objectId: number, hasBeenCleared: boolean): boolean => {
      if (hasBeenCleared || this.filterDates?.[0] == null || this.filterDates[1] == null) return true;
      const filterStartDate = new Date(this.filterDates[0]);
      const filterEndDate = DateUtils.dateAtLastSecondOfDay(this.filterDates[1]);
      return this.info[this.selectedScoutIndex].info.some(data => {
        const startDate = new Date(data.eventStartDate);
        const endDate = new Date(data.eventEndDate);
        return data.eventId === objectId && (startDate <= filterEndDate && endDate >= filterStartDate);
      });
    });
  }
}
