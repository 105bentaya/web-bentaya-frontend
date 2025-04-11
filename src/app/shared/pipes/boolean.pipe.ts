import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean): unknown {
    return value ? 'Sí' : 'No';
  }

}
