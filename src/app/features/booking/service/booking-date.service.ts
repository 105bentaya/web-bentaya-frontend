import {inject, Injectable} from '@angular/core';
import {BookingService} from "./booking.service";
import {map} from "rxjs";
import {DateUtils} from "../../../shared/util/date-utils";

@Injectable({
  providedIn: 'root'
})
export class BookingDateService {

  private readonly bookingService = inject(BookingService);

  private fullyOccupiedDates: Set<string> = new Set<string>();
  private occupiedDates: Set<string> = new Set<string>();
  private reservedDates: Set<string> = new Set<string>();

  public loadDates(centerId: number) {
    this.fullyOccupiedDates = new Set<string>();
    this.occupiedDates = new Set<string>();
    this.reservedDates = new Set<string>();
    return this.bookingService.getReservedDates(centerId).pipe(
      map(result => {
        result.forEach(date => {
          const currentDate = DateUtils.dateTruncatedToDay(date.startDate);
          const endDate = DateUtils.dateTruncatedToDay(date.endDate);
          while (currentDate <= endDate) {
            if (date.status == "RESERVED") this.reservedDates.add(currentDate.toDateString());
            else if (date.status == "OCCUPIED" && !date.fullyOccupied) this.occupiedDates.add(currentDate.toDateString());
            else if (date.status == "OCCUPIED" && date.fullyOccupied) this.fullyOccupiedDates.add(currentDate.toDateString());
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
      })
    );
  }

  public getDateClass(date: any) {
    const calendarDate = new Date(date.year, date.month, date.day).toDateString();
    if (this.fullyOccupiedDates.has(calendarDate)) return "fully-occupied";
    if (this.occupiedDates.has(calendarDate)) return "occupied";
    return this.reservedDates.has(calendarDate) ? "reserved" : "";
  }

  public getBookingDate() {  //todo: remove and replace with setting and check dates in backend
    return new Date(2025, 8, 30, 23, 59);
  }
}
