import {Pipe, PipeTransform} from '@angular/core';
import {ScoutType} from "../models/scout.model";
import {BasicGroupInfo} from "../../../shared/model/group.model";

@Pipe({
  name: 'scoutSection'
})
export class ScoutSectionPipe implements PipeTransform {

  transform(scoutType: ScoutType, group?: BasicGroupInfo): string {
    switch (scoutType) {
      case "SCOUT":
        return group?.section ?? "Educanda";
      case "SCOUTER":
        return "Scouter";
      case "COMMITTEE":
      case "MANAGER":
        return "Scoutsupport";
      case "INACTIVE":
        return "Sin Sección (Baja)";
      default:
        return "-";
    }
  }
}
