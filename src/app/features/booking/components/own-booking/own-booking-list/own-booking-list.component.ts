import {Component, inject, OnInit} from '@angular/core';
import {
  BasicLoadingInfoComponent
} from "../../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DatePipe, JsonPipe, LowerCasePipe, NgTemplateOutlet} from "@angular/common";
import {MultiSelect, MultiSelectChangeEvent} from "primeng/multiselect";
import {Panel} from "primeng/panel";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {PendingBookings} from "../../../model/pending-bookings.model";
import {RouterLink} from "@angular/router";
import {BasicGroupInfo} from "../../../../../shared/model/group.model";
import {FormsModule} from "@angular/forms";
import {GroupService} from "../../../../../shared/services/group.service";
import {BookingService} from "../../../service/booking.service";
import {Booking} from "../../../model/booking.model";
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {DatePicker} from "primeng/datepicker";
import {InputText} from "primeng/inputtext";
import {bookingStatuses} from "../../../constant/status.constant";

@Component({
  selector: 'app-own-booking-list',
  imports: [
    BasicLoadingInfoComponent,
    DatePipe,
    LowerCasePipe,
    MultiSelect,
    NgTemplateOutlet,
    Panel,
    PrimeTemplate,
    TableModule,
    RouterLink,
    FormsModule,
    JsonPipe,
    BookingStatusPipe,
    DatePicker,
    InputText
  ],
  templateUrl: './own-booking-list.component.html',
  styleUrl: './own-booking-list.component.scss'
})
export class OwnBookingListComponent implements OnInit {

  private readonly groupService = inject(GroupService);
  private readonly bookingService = inject(BookingService);

  pendingBookings!: Booking[];
  protected groups!: BasicGroupInfo[];
  selectedGroups: any;

  ngOnInit() {
    this.groupService.getAll().subscribe(groups => {
      this.groups = groups;
      this.groups.unshift({id: 0, name: "Grupo", order: 0});
    });
    this.bookingService.getOwnBookings().subscribe(res => this.pendingBookings = res);
  }

  onFilterChange(event?: MultiSelectChangeEvent) {
  }

  protected readonly statusesOptions = bookingStatuses;
}
