import {Component, inject, ViewChild} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {scoutCentersDropdown} from "../../../constant/scout-center.constant";
import {scoutCenterStatusesValues} from "../../../constant/status.constant";
import {Booking} from "../../../model/booking.model";
import {Table, TableModule} from "primeng/table";
import {MultiSelect} from "primeng/multiselect";
import {ScoutCenterStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ScoutCenterPipe} from "../../../pipe/scout-center.pipe";
import FilterUtils from "../../../../../shared/util/filter-utils";
import {InputText} from "primeng/inputtext";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {castArray, pick} from "lodash";
import {BookingManagementService} from "../../../service/booking-management.service";

@Component({
  selector: 'app-booking-list',
  imports: [
    TableModule,
    MultiSelect,
    ScoutCenterStatusPipe,
    DatePipe,
    RouterLink,
    ScoutCenterPipe,
    InputText,
    DatePicker,
    FormsModule
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent {

  private readonly bookingService = inject(BookingService);
  private readonly bookingManagement = inject(BookingManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly centers = scoutCentersDropdown;
  protected readonly statusesOptions = scoutCenterStatusesValues;
  protected bookings!: Booking[];

  protected loading = true;
  protected totalRecords: number = 0;
  protected dateRange: Date[] | undefined;

  protected scoutCenterFilter: string[];
  protected statusFilter: string[];

  @ViewChild("tab") private readonly table!: Table;

  constructor() {
    const filterParams = this.route.snapshot.queryParams;
    this.scoutCenterFilter = castArray(filterParams['scoutCenters'] ?? []);
    this.statusFilter = castArray(filterParams['statuses'] ?? []);
  }

  protected loadBookingWithFilter(tableLazyLoadEvent: any) {
    const filter = FilterUtils.lazyEventToFilter(tableLazyLoadEvent, 'startDate');
    this.bookingService.getAll(filter).subscribe({
      next: bookingPage => {
        this.bookings = bookingPage.data;
        this.totalRecords = bookingPage.count;
        this.loading = false;
      }, error: () => this.loading = false
    });
    this.router.navigate([], {queryParams: pick(filter, ['scoutCenters', 'statuses']), replaceUrl: true});
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

  protected updateRoute() {
    this.bookingManagement.updateLastRoute("lista", this.route.snapshot.queryParams);
  }
}
