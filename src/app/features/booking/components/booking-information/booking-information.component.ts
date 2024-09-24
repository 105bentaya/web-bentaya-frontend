import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CenterInformation} from "../../model/center-information.model";
import {BookingDateService} from "../../service/booking-date.service";
import {GalleriaModule} from 'primeng/galleria';
import {RouterLink} from '@angular/router';
import {CalendarModule} from 'primeng/calendar';
import {DateUtils} from "../../../../shared/util/date-utils";
import {AutoFocus} from "primeng/autofocus";

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.component.html',
  styleUrls: ['./booking-information.component.scss'],
  standalone: true,
  imports: [
    CalendarModule,
    RouterLink,
    GalleriaModule,
    AutoFocus
  ]
})
export class BookingInformationComponent implements OnChanges {

  private bookingDateService = inject(BookingDateService);

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
