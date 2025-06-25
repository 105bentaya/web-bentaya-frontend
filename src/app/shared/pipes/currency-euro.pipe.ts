import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from "@angular/common";

@Pipe({
  name: 'currencyEuro'
})
export class CurrencyEuroPipe implements PipeTransform {

  transform(value: number, isFloat = false): string {
    return new CurrencyPipe("es").transform(isFloat ? value : value / 100, "EUR")!;
  }
}
