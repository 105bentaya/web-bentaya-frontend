import {Pipe, PipeTransform} from '@angular/core';
import {ScoutStatus} from "../models/scout.model";

@Pipe({
  name: 'scoutStatus'
})
export class ScoutStatusPipe implements PipeTransform {

  transform(value: ScoutStatus, severity: boolean = false): any {
    switch (value) {
      case "ACTIVE":
        return severity ? 'success' : "Alta";
      case "PENDING_EXISTING":
      case "PENDING_NEW":
        return severity ? 'contrast' : "Alta Pendiente";
      case "INACTIVE":
        return severity ? 'danger' : "Baja";
    }
  }

}
