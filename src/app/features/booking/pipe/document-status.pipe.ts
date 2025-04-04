import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'documentStatus',
  standalone: true
})
export class DocumentStatusPipe implements PipeTransform {

  transform(value: string, style = false): any {
    if (value == "PENDING") return style ? "warn" : "Pendiente";
    if (value == "ACCEPTED") return style ? "success" : "Válido";
    if (value == "REJECTED") return style ? "danger" : "Inválido";
    return value;
  }
}
