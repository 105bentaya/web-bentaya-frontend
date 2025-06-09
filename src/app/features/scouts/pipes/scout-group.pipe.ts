import {Pipe, PipeTransform} from '@angular/core';
import {ScoutInfo} from "../models/scout.model";

@Pipe({
  name: 'scoutGroup'
})
export class ScoutGroupPipe implements PipeTransform {

  transform(scoutInfo: ScoutInfo): string {
    switch (scoutInfo.scoutType) {
      case "SCOUT":
        return scoutInfo.group!.name;
      case "SCOUTER":
        return scoutInfo.group ? `Kraal - ${scoutInfo.group.name}` : "Kraal - Grupo";
      case "COMMITTEE":
        return "Almogaren";
      case "MANAGER":
        return "Tagoror";
      case "INACTIVE":
        return "Guatatiboa";
      default:
        return "Sin Unidad";
    }
  }
}
