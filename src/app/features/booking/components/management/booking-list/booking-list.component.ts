import {Component, inject, ViewChild} from '@angular/core';
import {bookingStatuses} from "../../../constant/status.constant";
import {Table, TableModule} from "primeng/table";
import {MultiSelect} from "primeng/multiselect";
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import FilterUtils from "../../../../../shared/util/filter-utils";
import {InputText} from "primeng/inputtext";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {castArray, pick} from "lodash";
import {BookingManagementService} from "../../../service/booking-management.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MenuItem} from "primeng/api";
import {BookingFetcherService} from "../../../service/booking-fetcher.service";
import {BookingInfo} from "../../../model/booking-info.model";

@Component({
  selector: 'app-booking-list',
  imports: [
    TableModule,
    MultiSelect,
    BookingStatusPipe,
    DatePipe,
    RouterLink,
    InputText,
    DatePicker,
    FormsModule
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent {

  private readonly bookingService = inject(BookingFetcherService);
  private readonly bookingManagement = inject(BookingManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);


  protected readonly FilterUtils = FilterUtils;
  protected readonly statusesOptions = bookingStatuses;

  protected bookings!: BookingInfo[];
  protected loading = true;
  protected totalRecords: number = 0;

  protected centers!: MenuItem[];
  protected scoutCenterFilter: number[];
  protected statusFilter: string[];

  @ViewChild("tab") private readonly table!: Table;
  private readonly isManager: boolean;

  constructor() {
    const filterParams = this.route.snapshot.queryParams;
    this.scoutCenterFilter = castArray(filterParams['scoutCenters'] ?? []).map(id => +id);
    this.statusFilter = castArray(filterParams['statuses'] ?? []);
    this.bookingManagement.onUpdateBooking.pipe(takeUntilDestroyed()).subscribe(() => this.table._filter());
    this.bookingManagement.getScoutCenterDropdown().then(res => this.centers = res);

    this.isManager = this.route.snapshot.parent?.data['isManager'];
  }

  protected loadBookingWithFilter(tableLazyLoadEvent: any) {
    const filter = FilterUtils.lazyEventToFilter(tableLazyLoadEvent, 'startDate');
    this.bookingService.getAll(this.isManager, filter).subscribe({
      next: bookingPage => {
        this.bookings = bookingPage.data;
        this.totalRecords = bookingPage.count;
        this.loading = false;
      }, error: () => this.loading = false
    });
    this.router.navigate([], {queryParams: pick(filter, ['scoutCenters', 'statuses']), replaceUrl: true});
  }

  protected bookingRouterLink(id: number) {
    const link = this.isManager ? 'gestion' : 'seguimiento';
    return `/centros-scout/${link}/reserva/${id}`;
  }

  protected updateRoute() {
    this.bookingManagement.updateLastRoute("lista", this.route.snapshot.queryParams);
  }
}
