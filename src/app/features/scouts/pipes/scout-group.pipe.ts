import {Pipe, PipeTransform} from '@angular/core';
import {ScoutType} from "../models/scout.model";
import {BasicGroupInfo} from "../../../shared/model/group.model";

@Pipe({
  name: 'scoutGroup'
})
export class ScoutGroupPipe implements PipeTransform {

  transform(scoutType: ScoutType, group?: BasicGroupInfo): string {
    switch (scoutType) {
      case "SCOUT":
        return group?.name ?? "Educanda";
      case "SCOUTER":
        return group ? `Kraal - ${group?.name}` : "Kraal - Grupo";
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
