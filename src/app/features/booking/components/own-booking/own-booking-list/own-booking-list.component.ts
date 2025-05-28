import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {MultiSelect} from "primeng/multiselect";
import {MenuItem, PrimeTemplate} from "primeng/api";
import {Table, TableLazyLoadEvent, TableModule} from "primeng/table";
import {RouterLink} from "@angular/router";
import {BasicGroupInfo} from "../../../../../shared/model/group.model";
import {FormsModule} from "@angular/forms";
import {GroupService} from "../../../../../shared/services/group.service";
import {BookingService} from "../../../service/booking.service";
import {Booking} from "../../../model/booking.model";
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {bookingStatuses} from "../../../constant/status.constant";
import {Button} from "primeng/button";
import {OwnBookingFormComponent} from "../../management/own-booking-form/own-booking-form.component";
import {DialogService} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {noop} from "rxjs";
import {BookingManagementService} from "../../../service/booking-management.service";
import FilterUtils from "../../../../../shared/util/filter-utils";
import {DatePicker} from "primeng/datepicker";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {LoggedUserDataService} from "../../../../../core/auth/services/logged-user-data.service";

@Component({
  selector: 'app-own-booking-list',
  imports: [
    DatePipe,
    MultiSelect,
    PrimeTemplate,
    TableModule,
    RouterLink,
    FormsModule,
    BookingStatusPipe,
    Button,
    DatePicker
  ],
  templateUrl: './own-booking-list.component.html',
  styleUrl: './own-booking-list.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class OwnBookingListComponent implements OnInit {

  private readonly groupService = inject(GroupService);
  private readonly bookingService = inject(BookingService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly bookingManagement = inject(BookingManagementService);
  protected readonly statusesOptions = bookingStatuses.filter(status => status.value !== "NEW");

  protected loading = false;
  protected totalRecords: number = 0;
  protected dateRange: Date[] | undefined;

  protected bookings!: Booking[];

  protected groups!: BasicGroupInfo[];
  protected selectedGroups: number[];
  protected centers!: MenuItem[];
  private lastFilterEvent!: TableLazyLoadEvent;
  @ViewChild("tab") private readonly table!: Table;

  constructor() {
    const userGroupId = inject(LoggedUserDataService).getGroup()?.id;
    this.selectedGroups = userGroupId ? [userGroupId, 0] : [0];
  }

  ngOnInit() {
    this.bookingManagement.getScoutCenterDropdown().then(res => this.centers = res);
    this.groupService.getBasicGroups({generalGroup: true}).subscribe(groups => this.groups = groups);
  }

  protected openForm() {
    const ref = this.dialogService.openDialog(OwnBookingFormComponent, 'Añadir Reserva Propia', "medium");
    ref.onClose.subscribe(saved => saved ? this.loadBookingWithFilter(this.lastFilterEvent) : noop());
  }

  protected loadBookingWithFilter(event: any) {
    this.lastFilterEvent = event;
    const filter = FilterUtils.lazyEventToFilter(event, 'startDate');
    this.bookingService.getOwnBookings(filter).subscribe({
      next: result => {
        this.bookings = result.data;
        this.totalRecords = result.count;
        this.loading = false;
      }
    });
  }

  protected filterDates() {
    if (this.dateRange?.[0] && this.dateRange?.[1]) {
      const startDate = DateUtils.toLocalDateTime(this.dateRange[0]);
      const endDate = DateUtils.toLocalDateTime(this.dateRange[1]);
      this.table.filter([startDate, endDate], "filterDates", "custom");
    } else {
      this.table.filter(null, "filterDates", "custom");
    }
  }
}
