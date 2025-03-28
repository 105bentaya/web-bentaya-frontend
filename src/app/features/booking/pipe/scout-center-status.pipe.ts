import {Pipe, PipeTransform} from '@angular/core';
import {bookingStatusValues, Status} from "../constant/status.constant";

@Pipe({
  name: 'bookingStatus',
  standalone: true
})
export class BookingStatusPipe implements PipeTransform {

  transform(value: Status, mode: 'label' | 'severity' = 'label'): any {
    const status = bookingStatusValues[value];
    switch (mode) {
      case "label":
        return status.label;
      case "severity":
        return status.severity;
    }
  }
}
