import {Pipe, PipeTransform} from '@angular/core';
import {IdentificationDocument} from "./models/member.model";

@Pipe({
  name: 'idDocumentType'
})
export class IdDocumentTypePipe implements PipeTransform {

  transform(value: IdentificationDocument | undefined): string {
    if (!value) return "Documento de Identidad";
    switch (value.idType) {
      case "PAS":
        return "Pasaporte";
      case "OTR":
        return "Documento de Identidad";
      default:
        return value.idType;
    }
  }
}
