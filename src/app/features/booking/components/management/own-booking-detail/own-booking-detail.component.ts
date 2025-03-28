import {Component, inject, Input} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {BookingStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {Booking} from "../../../model/booking.model";
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";

@Component({
  selector: 'app-own-booking-detail',
  imports: [
    CurrencyPipe,
    DatePipe,
    DialogModule,
    DividerModule,
    BookingStatusPipe,
    Button
  ],
  providers: [DialogService, DynamicDialogService],
  templateUrl: './own-booking-detail.component.html',
  styleUrl: './own-booking-detail.component.scss'
})
export class OwnBookingDetailComponent {

  private readonly bookingService = inject(BookingService);
  private readonly dialogService = inject(DynamicDialogService);

  @Input() booking!: Booking;
  protected loading = false;
  private ref!: DynamicDialogRef;

  protected cancelBooking() {
    this.ref = this.dialogService.openDialog(BookingStatusUpdateComponent, "Actualizar reserva a cancelada", "small", {
      floatLabel: "Motivo de la cancelación",
      required: true
    });
    this.ref.onClose.subscribe(result => {
      if (result) this.realCancelBooking(result.comment);
    });
  }

  protected realCancelBooking(comment: string) {
    this.bookingService.cancelOwnBooking(this.booking.id, comment).subscribe({
      next: booking => this.booking = booking
    });
  }
}

