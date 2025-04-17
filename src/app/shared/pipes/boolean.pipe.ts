import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean | undefined, inverted = false): string {
    const result = inverted ? !value : !!value;
    return result ? 'Sí' : 'No';
  }
}
