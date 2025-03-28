import {Component, inject, OnInit} from '@angular/core';
import {BookingInformationComponent} from '../booking-information/booking-information.component';
import {FlexCardComponent} from '../../../../shared/components/flex-card/flex-card.component';
import {RouterLink} from '@angular/router';
import {ScoutCenterService} from "../../../scout-center/scout-center.service";
import {ScoutCenterInformation} from "../../../scout-center/scout-center.model";
import {BookingDateService} from "../../service/booking-date.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-booking-home',
  templateUrl: './booking-home.component.html',
  styleUrls: ['./booking-home.component.scss'],
  imports: [
    RouterLink,
    FlexCardComponent,
    BookingInformationComponent,
    DatePipe
  ]
})
export class BookingHomeComponent implements OnInit {

  private readonly scoutCenterService = inject(ScoutCenterService);
  protected selectedOption = 0;
  protected colors = ["#ED5565", "#f89853", "#2ECC71", "#AC92EC"];
  protected scoutCenters!: ScoutCenterInformation[];
  protected maxDate!: Date;

  constructor() {
    inject(BookingDateService).getBookingDate().then(date => this.maxDate = date);
  }

  ngOnInit() {
    this.scoutCenterService.getAllInformation().subscribe(result => this.scoutCenters = result);
  }
}
