import {Component, inject, OnInit, viewChild} from '@angular/core';
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BookingCalendarComponent} from "../booking-calendar/booking-calendar.component";
import {Booking} from "../../../model/booking.model";
import {BookingCalendarInfo} from "../../../model/booking-calendar-info.model";
import {BookingDetailComponent} from "../booking-detail/booking-detail.component";
import {
  GeneralAButtonComponent
} from "../../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {BookingManagementService} from "../../../service/booking-management.service";
import {ToggleButton} from "primeng/togglebutton";
import {Status} from "../../../constant/status.constant";
import {FormsModule} from "@angular/forms";
import {BookingFetcherService} from "../../../service/booking-fetcher.service";
import {BookingEditorComponent} from "../booking-editor/booking-editor.component";

@Component({
  selector: 'app-booking-detail-control',
  imports: [
    BasicLoadingInfoComponent,
    BookingCalendarComponent,
    BookingDetailComponent,
    GeneralAButtonComponent,
    ToggleButton,
    FormsModule,
    BookingEditorComponent
  ],
  templateUrl: './booking-detail-control.component.html',
  styleUrl: './booking-detail-control.component.scss'
})
export class BookingDetailControlComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingFetcherService);
  protected readonly bookingManagement = inject(BookingManagementService);

  protected id!: number;
  protected booking: Booking | undefined;

  private allDateRanges!: BookingCalendarInfo[];
  protected dateRanges!: BookingCalendarInfo[];
  protected showCancelled = false;

  protected editing: boolean = false;
  private bookingEditor = viewChild.required(BookingEditorComponent);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.booking = undefined;
      this.id = +params['bookingId']!;
      this.loadBooking();
    });
  }

  private getDateRanges(centerId: number) {
    this.bookingService.getAllForCalendar({scoutCenters: centerId}).subscribe(result => {
      this.allDateRanges = result;
      this.filterDateRanges();
    });
  }

  private dateRangeIsCanceledOrRejected(dateRange: BookingCalendarInfo) {
    return dateRange.id !== this.id && (dateRange.status === Status.CANCELED || dateRange.status === Status.REJECTED);
  }

  protected reloadInfo(bookingId: number) {
    this.router.navigateByUrl(`/centros-scout/gestion/reserva/${bookingId}`);
  }

  protected loadBooking() {
    this.bookingService.getById(this.id).subscribe({
      next: (result) => {
        this.booking = result;
        this.editing = false;
        this.getDateRanges(result.scoutCenter.id);
      }
    });
  }

  protected goBack() {
    this.router.navigate([`/centros-scout/gestion/${this.bookingManagement.getLastRoute()}`], {queryParams: this.bookingManagement.getLastParams()});
  }

  protected filterDateRanges() {
    this.dateRanges = this.showCancelled ? this.allDateRanges :
      this.allDateRanges.filter(dateRange => !this.dateRangeIsCanceledOrRejected(dateRange));
  }

  protected startBookingEdition() {
    this.editing = true;
    this.bookingEditor().initEdition(this.booking!);
  }
}
