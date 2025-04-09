import {Component, inject, OnInit} from '@angular/core';
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {Button} from "primeng/button";
import {DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {Booking, bookingIsAlwaysExclusive} from "../../../model/booking.model";
import {BookingService} from "../../../service/booking.service";
import {ActivatedRoute} from "@angular/router";
import {
  GeneralAButtonComponent
} from "../../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {BookingStatusUpdateComponent} from "../../management/booking-status-update/booking-status-update.component";
import {filter} from "rxjs";
import {identity} from "lodash";
import {DialogService} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {ScoutCenterService} from "../../../../scout-center/scout-center.service";
import {FileUtils} from "../../../../../shared/util/file.utils";

@Component({
  selector: 'app-own-booking-follow-up',
  imports: [
    BookingStatusPipe,
    Button,
    DatePipe,
    TableModule,
    Tag,
    GeneralAButtonComponent,
    BasicLoadingInfoComponent
  ],
  templateUrl: './own-booking-follow-up.component.html',
  styleUrl: './own-booking-follow-up.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class OwnBookingFollowUpComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly scoutCenterService = inject(ScoutCenterService);
  private readonly dialogService = inject(DynamicDialogService);


  protected readonly bookingIsAlwaysExclusive = bookingIsAlwaysExclusive;

  private bookingId: number;
  protected booking!: Booking;
  protected loading = false;

  constructor() {
    this.bookingId = inject(ActivatedRoute).snapshot.params['bookingId'];
  }

  ngOnInit() {
    this.getBooking();
  }

  private getBooking() {
    this.bookingService.getOwnById(this.bookingId).subscribe(data => {
      this.booking = data;
      this.loading = false;
    });
  }

  protected cancelReservation() {
    const dialogData: any = {
      textAreaLabel: "Motivo de la cancelación",
      textRequired: true
    };

    this.dialogService.openDialog(BookingStatusUpdateComponent, "Cancelar reserva", "small", dialogData).onClose
      .pipe(filter(identity))
      .subscribe(({observations}) => this.cancelBooking(observations));
  }

  private cancelBooking(observations: string) {
    this.loading = true;
    this.bookingService.cancelOwnBooking(this.booking.id, {observations})
      .subscribe({
        next: () => this.getBooking(),
        error: () => this.loading = false
      });
  }

  protected downloadRuleFile(centerId: number) {
    this.scoutCenterService.getRuleFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }
}
