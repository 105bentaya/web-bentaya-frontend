import {Component, inject, OnInit} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {BookingDate} from "../../../model/booking-date.model";
import {BookingCalendarComponent} from "../booking-calendar/booking-calendar.component";
import {MultiSelect} from "primeng/multiselect";
import {scoutCentersDropdown} from "../../../constant/scout-center.constant";
import {FormsModule} from "@angular/forms";
import {finalize} from "rxjs";
import {scoutCenterStatusesValues} from "../../../constant/status.constant";
import {castArray, pick} from "lodash";
import {ActivatedRoute, Router} from "@angular/router";
import {JoinPipe} from "../../../../../shared/pipes/join.pipe";
import {PrimeTemplate} from "primeng/api";
import {ScoutCenterStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {ScoutCenterPipe} from "../../../pipe/scout-center.pipe";
import {BookingManagementService} from "../../../service/booking-management.service";

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
  protected readonly statusPipe = new ScoutCenterStatusPipe();
  protected readonly scoutCenterPipe = new ScoutCenterPipe();
  protected readonly centers = scoutCentersDropdown;
  protected readonly statuses = scoutCenterStatusesValues;

  protected dateRanges: BookingDate[] = [];
  protected loading: boolean = false;

  protected scoutCenterFilter: any;
  protected statusFilter: any;

  constructor() {
    const filterParams = this.route.snapshot.queryParams;
    this.scoutCenterFilter = castArray(filterParams['scoutCenters'] ?? []);
    this.statusFilter = castArray(filterParams['statuses'] ?? []);
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
