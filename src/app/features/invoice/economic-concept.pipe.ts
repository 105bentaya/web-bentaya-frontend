import {Pipe, PipeTransform} from '@angular/core';
import {InvoiceConceptType} from "./invoice.model";

@Pipe({
  name: 'economicConcept'
})
export class EconomicConceptPipe implements PipeTransform {

  transform(concept: InvoiceConceptType): string {
    return `${concept.id} - ${concept.description}`;
  }
}
