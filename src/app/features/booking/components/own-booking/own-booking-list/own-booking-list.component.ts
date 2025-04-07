import {Component, inject, OnInit} from '@angular/core';
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DatePipe} from "@angular/common";
import {MultiSelect, MultiSelectChangeEvent} from "primeng/multiselect";
import {PrimeTemplate} from "primeng/api";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {RouterLink} from "@angular/router";
import {BasicGroupInfo} from "../../../../../shared/model/group.model";
import {FormsModule} from "@angular/forms";
import {GroupService} from "../../../../../shared/services/group.service";
import {BookingService} from "../../../service/booking.service";
import {Booking} from "../../../model/booking.model";
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {bookingStatuses} from "../../../constant/status.constant";
import {Button} from "primeng/button";
import {OwnBookingFormComponent} from "../../management/own-booking-form/own-booking-form.component";
import {DialogService} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {noop} from "rxjs";
import {BookingManagementService} from "../../../service/booking-management.service";

@Component({
  selector: 'app-own-booking-list',
  imports: [
    BasicLoadingInfoComponent,
    DatePipe,
    MultiSelect,
    PrimeTemplate,
    TableModule,
    RouterLink,
    FormsModule,
    BookingStatusPipe,
    Button
  ],
  templateUrl: './own-booking-list.component.html',
  styleUrl: './own-booking-list.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class OwnBookingListComponent implements OnInit {

  private readonly groupService = inject(GroupService);
  private readonly bookingService = inject(BookingService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly bookingManagement = inject(BookingManagementService);
  protected readonly statusesOptions = bookingStatuses;

  loading = false;
  protected totalRecords: number = 0;

  pendingBookings!: Booking[];
  protected groups!: BasicGroupInfo[];
  selectedGroups: any;

  ngOnInit() {
    this.groupService.getAll().subscribe(groups => {
      this.groups = groups;
      this.groups.unshift({id: 0, name: "Grupo", order: 0});
    });
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getOwnBookings().subscribe(res => this.pendingBookings = res);
  }

  onFilterChange(event?: MultiSelectChangeEvent) {
  }

  openForm() {
    const ref = this.dialogService.openDialog(OwnBookingFormComponent, 'Añadir Reserva Propia', "medium");
    ref.onClose.subscribe(saved => saved ? this.getBookings() : noop());
  }

  loadBookingWithFilter(event: TableLazyLoadEvent) {

  }
}
