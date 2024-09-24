import {Pipe, PipeTransform} from '@angular/core';
import {ScoutCenterStatusesValues} from "../constant/status.constant";

@Pipe({
  name: 'scoutCenterStatus',
  standalone: true
})
export class ScoutCenterStatusPipe implements PipeTransform {

  transform(value: string, styleClass = false): string {
    const status = ScoutCenterStatusesValues.find(status => status.value == value);
    return (styleClass ? status?.styleClass : status?.label) ?? value;
  }
}
