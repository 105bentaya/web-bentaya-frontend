import {Component, inject, Input} from '@angular/core';
import {BookingService} from "../../service/booking.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ScoutCenterStatusPipe} from "../../pipe/scout-center-status.pipe";
import {Booking} from "../../model/booking.model";
import {ButtonDirective} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {DocumentStatusPipe} from "../../pipe/dcoument-status.pipe";
import {
  GeneralIconButtonComponent
} from "../../../../shared/components/general-icon-button/general-icon-button.component";
import {ScoutCenterPipe} from "../../pipe/scout-center.pipe";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";

@Component({
  selector: 'app-own-booking-detail',
  standalone: true,
  imports: [
    ButtonDirective,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    DividerModule,
    DocumentStatusPipe,
    GeneralIconButtonComponent,
    ScoutCenterPipe,
    ScoutCenterStatusPipe
  ],
  providers: [DialogService],
  templateUrl: './own-booking-detail.component.html',
  styleUrl: './own-booking-detail.component.scss'
})
export class OwnBookingDetailComponent {

  private bookingService = inject(BookingService);
  private alertService = inject(AlertService);
  private dialogService = inject(DialogService);

  @Input() booking!: Booking;
  protected loading = false;
  private ref!: DynamicDialogRef;

  protected cancelBooking() {
    this.ref = this.dialogService.open(BookingStatusUpdateComponent, {
      header: "Actualizar reserva a cancelada",
      styleClass: 'dialog-width small',
      data: {floatLabel: "Motivo de la cancelación", required: true}
    });
    this.ref.onClose.subscribe(result => {
      if (result) this.realCancelBooking(result.comment);
    });
  }

  protected realCancelBooking(comment: string) {
    this.bookingService.cancelOwnBooking(this.booking.id, comment).subscribe({
      next: booking => this.booking = booking,
      error: err => this.alertService.sendBasicErrorMessage(err)
    });
  }
}

