import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true
})
export class JoinPipe implements PipeTransform {

  transform(array: any[], property?: string): unknown {
    return property ?
      array.map(item => item[property]).join(", ") :
      array.join(", ");
  }
}
