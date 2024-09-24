import {Pipe, PipeTransform} from '@angular/core';
import {EventAttendanceInfo} from "../../features/attendance/models/event-attendance-info.model";

@Pipe({
  name: 'scouts',
  standalone: true
})
export class ScoutsPipe implements PipeTransform {

  transform(value: EventAttendanceInfo[]): unknown {
    return value.map(scout => `${scout.name} ${scout.surname}`).join(", ");
  }

}
