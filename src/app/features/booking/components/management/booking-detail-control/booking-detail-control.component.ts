import {Component, inject, OnInit} from '@angular/core';
import {BasicLoadingInfoComponent} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BookingCalendarComponent} from "../booking-calendar/booking-calendar.component";
import {BookingService} from "../../../service/booking.service";
import {Booking} from "../../../model/booking.model";
import {ScoutCenter} from "../../../constant/scout-center.constant";
import {BookingDate} from "../../../model/booking-date.model";
import {BookingDetailComponent} from "../booking-detail/booking-detail.component";
import {OwnBookingDetailComponent} from "../own-booking-detail/own-booking-detail.component";
import {
  GeneralAButtonComponent
} from "../../../../../shared/components/buttons/general-a-button/general-a-button.component";

@Component({
  selector: 'app-booking-detail-control',
  imports: [
    BasicLoadingInfoComponent,
    RouterLink,
    BookingCalendarComponent,
    BookingDetailComponent,
    OwnBookingDetailComponent,
    GeneralAButtonComponent
  ],
  templateUrl: './booking-detail-control.component.html',
  styleUrl: './booking-detail-control.component.scss'
})
export class BookingDetailControlComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  protected id!: number;
  protected booking: Booking | undefined;
  protected dateRanges!: BookingDate[];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.booking = undefined;
      this.id = +params['bookingId']!;
      this.bookingService.getById(this.id).subscribe({
        next: (result) => {
          this.booking = result;
          this.getDateRanges(result.scoutCenter);
        }
      });
    });
  }

  private getDateRanges(center: ScoutCenter) {
    this.bookingService.getCenterBookingDates({scoutCenters: center}).subscribe(result => this.dateRanges = result);
  }

  protected reloadInfo(eventId: number) {
    this.router.navigateByUrl(`/centros-scout/gestion/reserva/${eventId}`);
  }
}
