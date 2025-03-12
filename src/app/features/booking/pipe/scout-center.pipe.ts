import {Pipe, PipeTransform} from '@angular/core';
import {scoutCentersDropdown} from "../constant/scout-center.constant";

@Pipe({
  name: 'scoutCenter',
  standalone: true
})
export class ScoutCenterPipe implements PipeTransform {

  transform(value: string): string {
    return scoutCentersDropdown.find(center => center.value == value)?.label || value;
  }
}
