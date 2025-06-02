import {Pipe, PipeTransform} from '@angular/core';
import {ScoutInfo} from "./models/scout.model";

@Pipe({
  name: 'scoutSection'
})
export class ScoutSectionPipe implements PipeTransform {

  transform(scoutInfo: ScoutInfo): string {
    switch (scoutInfo.scoutType) {
      case "SCOUT":
        return scoutInfo.group!.section!;
      case "SCOUTER":
        return "Scouter";
      case "COMMITTEE":
      case "MANAGER":
        return "Scoutsupport";
      case "INACTIVE":
        return "Sin Sección";
      default:
        return "-";
    }
  }
}
