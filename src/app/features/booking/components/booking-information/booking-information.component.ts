import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ScoutCenterInformation} from "../../../scout-center/scout-center.model";
import {BookingDateService} from "../../service/booking-date.service";
import {GalleriaModule} from 'primeng/galleria';
import {RouterLink} from '@angular/router';
import {DateUtils} from "../../../../shared/util/date-utils";
import {AutoFocus} from "primeng/autofocus";
import {DatePicker} from "primeng/datepicker";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {Button} from "primeng/button";
import {ScoutCenterService} from "../../../scout-center/scout-center.service";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.component.html',
  styleUrls: ['./booking-information.component.scss'],
  imports: [
    RouterLink,
    GalleriaModule,
    AutoFocus,
    DatePicker,
    GeneralAButtonComponent,
    Button,
    CurrencyEuroPipe
  ]
})
export class BookingInformationComponent implements OnChanges {

  private readonly bookingDateService = inject(BookingDateService);
  protected readonly scoutCenterService = inject(ScoutCenterService);

  @Input() information!: ScoutCenterInformation;
  @Input() color: any;
  protected minDate: Date = DateUtils.tomorrow();
  protected maxDate!: Date;
  protected datesLoaded = false;
  protected displayBasic = false;

  constructor() {
    this.bookingDateService.getBookingDate().then(date => this.maxDate = date);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["information"]) {
      this.loadDates();
    }
  }

  private loadDates() {
    this.bookingDateService.loadDates(this.information.id).subscribe(
      () => setTimeout(() => this.datesLoaded = true, 200)
    );
  }

  protected getDateClass(date: any) {
    return this.bookingDateService.getDateClass(date);
  }
}
