import {Pipe, PipeTransform} from '@angular/core';
import {ScoutCentersDropdown} from "../constant/scout-center.constant";

@Pipe({
  name: 'scoutCenter',
  standalone: true
})
export class ScoutCenterPipe implements PipeTransform {

  transform(value: string): string {
    return ScoutCentersDropdown.find(center => center.value == value)?.label || value;
  }
}
