import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'documentStatus',
  standalone: true
})
export class DocumentStatusPipe implements PipeTransform {

  transform(value: string, style = false): string {
    if (value == "PENDING") return style ? "bg-warning-subtle" : "Pendiente de revisión";
    if (value == "ACCEPTED") return style ? "bg-success-subtle" : "Documento válido";
    if (value == "REJECTED") return style ? "bg-danger-subtle" : "Documento inválido";
    return value;
  }
}
