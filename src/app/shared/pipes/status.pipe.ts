import {Pipe, PipeTransform} from '@angular/core';
import {statuses} from "../../features/scout-forms/models/satus.model";

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {

  transform(value: number, group?: string): string {
    if (value == null) return "Sin Asignar";
    let result = statuses[value]?.name || "Estado desconocido";
    if (group) result += ` (${group})`;
    return result;
  }
}
