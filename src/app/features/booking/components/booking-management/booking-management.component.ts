import {Component, inject, OnInit} from '@angular/core';
import {ScoutCenters} from "../../constant/scout-center.constant";
import {BookingService} from "../../service/booking.service";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";
import {Booking} from "../../model/booking.model";
import {ScoutCenterStatusesValues} from "../../constant/status.constant";
import {ScoutCenterStatusPipe} from '../../pipe/scout-center-status.pipe';
import {ScoutCenterPipe} from '../../pipe/scout-center.pipe';
import {RouterLink} from '@angular/router';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {DialogService} from "primeng/dynamicdialog";
import {OwnBookingFormComponent} from "../own-booking-form/own-booking-form.component";
import {noop} from "rxjs";

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    TabViewModule,
    ScoutCenterPipe,
    TableModule,
    MultiSelectModule,
    RouterLink,
    ScoutCenterStatusPipe,
    DatePipe
  ],
  providers: [DialogService]
})
export class BookingManagementComponent implements OnInit {

  private bookingService = inject(BookingService);
  private dialogService = inject(DialogService);

  protected centers = ScoutCenters;
  protected statusesOptions: { label: string, value: string }[] = ScoutCenterStatusesValues;
  private bookings!: Booking[];
  protected selectedBookings!: Booking[];
  protected loading = true;
  private selectedIndex = 0;

  ngOnInit(): void {
    this.getBookings();
  }

  private getBookings() {
    this.bookingService.getAll().subscribe(result => {
      this.bookings = result;
      this.changeInfo();
      this.loading = false;
    });
  }

  protected changeInfo(event?: TabViewChangeEvent) {
    if (event) this.selectedIndex = event.index;
    this.loading = true;
    this.selectedBookings = this.bookings
      .filter(booking => booking.scoutCenter == this.centers[this.selectedIndex])
      .sort((a, b) => this.dateComparator(a.creationDate, b.creationDate));
    this.loading = false;
  }

  private dateComparator(a: Date, b: Date) {
    return new Date(b).getTime() - new Date(a).getTime();
  }

  protected openOwnBookingDialog() {
    const ref = this.dialogService.open(OwnBookingFormComponent, {
      header: 'Añadir Reserva Propia',
      styleClass: 'dialog-width medium'
    });
    ref.onClose.subscribe(saved => saved ? this.getBookings() : noop());
  }
}
