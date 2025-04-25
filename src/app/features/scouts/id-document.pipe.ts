import {Pipe, PipeTransform} from '@angular/core';
import {IdentificationDocument} from "./models/member.model";

@Pipe({
  name: 'idDocument'
})
export class IdDocumentPipe implements PipeTransform {

  transform(value: IdentificationDocument | undefined, showType = false): string {
    if (!value) return "Sin especificar";
    if (!showType) return value.number;
    const type = value.idType == "OTR" ? "Tipo Desconocido" : value.idType;
    return `${value.number} (${type})`;
  }
}
