import {Component, inject, OnInit} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {BookingCalendarInfo} from "../../../model/booking-calendar-info.model";
import {BookingCalendarComponent} from "../booking-calendar/booking-calendar.component";
import {MultiSelect} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {finalize} from "rxjs";
import {bookingStatuses} from "../../../constant/status.constant";
import {castArray, pick} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {JoinPipe} from "../../../../../shared/pipes/join.pipe";
import {MenuItem, PrimeTemplate} from "primeng/api";
import {BookingStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {BookingManagementService} from "../../../service/booking-management.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-booking-management-calendar',
  imports: [
    BookingCalendarComponent,
    MultiSelect,
    FormsModule,
    JoinPipe,
    PrimeTemplate
  ],
  templateUrl: './booking-management-calendar.component.html',
  styleUrl: './booking-management-calendar.component.scss'
})
export class BookingManagementCalendarComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly bookingManagement = inject(BookingManagementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly statusPipe = new BookingStatusPipe();

  protected readonly statuses = bookingStatuses;

  protected centers!: MenuItem[];
  protected scoutCenterFilter: number[];
  protected statusFilter: any;

  protected dateRanges: BookingCalendarInfo[] = [];
  protected loading: boolean = false;


  constructor() {
    const filterParams = this.route.snapshot.queryParams;
    this.scoutCenterFilter = castArray(filterParams['scoutCenters'] ?? []).map(id => +id);
    this.statusFilter = castArray(filterParams['statuses'] ?? []);
    this.bookingManagement.onUpdateBooking.pipe(takeUntilDestroyed()).subscribe(() => this.getBookingDates());
    this.bookingManagement.getScoutCenterDropdown().then(res => this.centers = res);
  }

  ngOnInit() {
    this.getBookingDates();
  }

  protected getBookingDates() {
    this.loading = true;
    this.bookingService.getCenterBookingDates(this.createFilter())
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => this.dateRanges = result);
  }

  private createFilter() {
    const filter: any = {};
    if (this.scoutCenterFilter?.length > 0) filter["scoutCenters"] = this.scoutCenterFilter;
    if (this.statusFilter?.length > 0) filter["statuses"] = this.statusFilter;
    this.router.navigate([], {queryParams: pick(filter, ['scoutCenters', 'statuses']), replaceUrl: true});
    return filter;
  }

  protected navigateToDetail(id: number) {
    this.bookingManagement.updateLastRoute("calendario", this.route.snapshot.queryParams);
    this.router.navigateByUrl(`/centros-scout/gestion/reserva/${id}`);
  }
}
