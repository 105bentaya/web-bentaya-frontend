import {Component, inject, OnInit} from '@angular/core';
import {ConfirmationService} from "../../services/confirmation.service";
import {UserListInfo} from "../../models/user-list-info.model";
import {FilterService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {NotificationService} from "../../../../core/notification/notification.service";
import {EventInfoComponent} from "../../../calendar/components/event-info/event-info.component";
import {TagModule} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {BadgeModule} from 'primeng/badge';
import {TabMenuModule} from 'primeng/tabmenu';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {ToggleButtonModule} from "primeng/togglebutton";
import {Confirmation} from "../../models/confirmation.model";
import {AttendanceFormComponent} from "../attendance-form/attendance-form.component";
import {DateUtils} from "../../../../shared/util/date-utils";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DatePicker} from "primeng/datepicker";
import {Tab, TabList, Tabs} from "primeng/tabs";
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";

@Component({
  selector: 'app-user-attendance-list',
  templateUrl: './user-attendance-list.component.html',
  styleUrls: ['./user-attendance-list.component.scss'],
  providers: [DialogService],
  imports: [
    FormsModule,
    ToggleButtonModule,
    TabMenuModule,
    TableModule,
    BadgeModule,
    NgClass,
    TagModule,
    DatePipe,
    BasicLoadingInfoComponent,
    DatePicker,
    Tabs,
    TabList,
    Tab,
    TableIconButtonComponent
  ]
})
export class UserAttendanceListComponent implements OnInit {

  private readonly filterService = inject(FilterService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly dialogService = inject(DialogService);
  private readonly notificationService = inject(NotificationService);

  private readonly yesterday = DateUtils.plusDays(new Date(), -1);
  protected tabItems!: { scoutName: string; showBadge: boolean, scoutId: number }[];
  protected info!: UserListInfo[];
  protected selectedScoutIndex = 0;
  protected filterDates!: Date[];
  protected showClosedButton = false;
  private ref!: DynamicDialogRef;

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
          this.updateBadge(scoutId, editedScout);
        }

        if (!this.info.some(scout => scout.info.some(info => !info.closed && info.attending == null))) {
          this.notificationService.userHasNoNotifications();
        }
      }
    });
  }

  private updateBadge(scoutId: number, editedScout: UserListInfo) {
    const scoutHasUnconfirmedAttendances = editedScout.info.some(info => !info.closed && info.attending == null);
    const scoutTab = this.tabItems.find(item => item.scoutId === scoutId)!;
    scoutTab.showBadge = scoutHasUnconfirmedAttendances;
  }

  protected openInfoDialog(eventId: number) {
    this.ref = this.dialogService.open(EventInfoComponent, {
      header: 'Actividad',
      styleClass: 'small-dw dialog-width',
      data: eventId
    });
  }

  private generateMenuItems() {
    this.tabItems = this.info.map(scout => ({
      scoutName: scout.name,
      showBadge: scout.info.some(info => !info.closed && info.attending == null),
      scoutId: scout.scoutId
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
