import {Component, inject, OnInit} from '@angular/core';
import {JoinPipe} from "../../../../../shared/pipes/join.pipe";
import {MultiSelect} from "primeng/multiselect";
import {PrimeTemplate} from "primeng/api";
import {scoutCentersDropdown} from "../../../constant/scout-center.constant";
import {FormsModule} from "@angular/forms";
import {ScoutCenterPipe} from "../../../pipe/scout-center.pipe";
import {castArray, isNull, omitBy} from "lodash";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Panel} from "primeng/panel";
import {DatePipe, LowerCasePipe, NgTemplateOutlet} from "@angular/common";
import {TableModule} from "primeng/table";
import {BookingService} from "../../../service/booking.service";
import {PendingBookings} from "../../../model/pending-bookings.model";
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {finalize} from "rxjs";
import {BookingManagementService} from "../../../service/booking-management.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-pending-bookings',
  imports: [
    JoinPipe,
    MultiSelect,
    PrimeTemplate,
    FormsModule,
    Panel,
    DatePipe,
    RouterLink,
    ScoutCenterPipe,
    TableModule,
    LowerCasePipe,
    NgTemplateOutlet,
    BasicLoadingInfoComponent
  ],
  templateUrl: './pending-bookings.component.html',
  styleUrl: './pending-bookings.component.scss'
})
export class PendingBookingsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  private readonly bookingManagement = inject(BookingManagementService);

  protected readonly centers = scoutCentersDropdown;
  protected scoutCenterPipe = new ScoutCenterPipe();

  protected scoutCenterFilter: any;
  protected pendingBookings!: PendingBookings;
  protected loading = false;

  constructor() {
    this.scoutCenterFilter = castArray(this.route.snapshot.queryParams['scoutCenters'] ?? []);
    this.bookingManagement.onUpdateBooking.pipe(takeUntilDestroyed()).subscribe(() => this.getBookings());
  }

  ngOnInit() {
    this.getBookings();
  }

  protected onFilterChange() {
    this.getBookings();
    this.router.navigate([], {queryParams: {scoutCenters: this.scoutCenterFilter}, replaceUrl: true});
  }

  private getBookings() {
    this.loading = true;
    this.bookingService.getAllPending(omitBy({scoutCenters: this.scoutCenterFilter}, isNull))
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => this.pendingBookings = result);
  }

  protected updateLastRoute() {
    this.bookingManagement.updateLastRoute("pendientes", this.route.snapshot.queryParams);
  }
}
