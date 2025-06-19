import { Pipe, PipeTransform } from '@angular/core';
import {EntryType} from "../models/scout.model";

@Pipe({
  name: 'entryType'
})
export class EntryTypePipe implements PipeTransform {

  transform(value: EntryType): string {
    switch (value) {
      case "DONATION":
        return "Donación";
      case "PAYMENT":
        return "Pago";
      case "CONTRIBUTION":
        return "Aportación";
      case "CHARGE":
        return "Cobro";
    }
  }

}
