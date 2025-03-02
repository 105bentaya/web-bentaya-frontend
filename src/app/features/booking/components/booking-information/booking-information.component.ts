import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CenterInformation} from "../../model/center-information.model";
import {BookingDateService} from "../../service/booking-date.service";
import {GalleriaModule} from 'primeng/galleria';
import {RouterLink} from '@angular/router';
import {DateUtils} from "../../../../shared/util/date-utils";
import {AutoFocus} from "primeng/autofocus";
import {DatePicker} from "primeng/datepicker";
import {Button} from "primeng/button";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.component.html',
  styleUrls: ['./booking-information.component.scss'],
  imports: [
    RouterLink,
    GalleriaModule,
    AutoFocus,
    DatePicker,
    Button,
    GeneralAButtonComponent
  ]
})
export class BookingInformationComponent implements OnChanges {

  private readonly bookingDateService = inject(BookingDateService);

  @Input() information!: CenterInformation;
  @Input() color: any;
  protected minDate: Date = DateUtils.tomorrow();
  protected maxDate: Date = this.bookingDateService.getBookingDate();
  protected datesLoaded = false;
  protected displayBasic = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["information"]) {
      this.loadDates();
    }
  }

  private loadDates() {
    this.bookingDateService.loadDates(this.information.center).subscribe(
      () => setTimeout(() => this.datesLoaded = true, 200)
    );
  }

  protected getDateClass(date: any) {
    return this.bookingDateService.getDateClass(date);
  }
}
