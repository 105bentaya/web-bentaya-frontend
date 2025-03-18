import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true
})
export class JoinPipe implements PipeTransform {

  transform(array: any[], property?: string, pipe?: PipeTransform): string {
    if (!array || array.length < 1) return "";
    if (property) array = array.map(item => item[property]);
    if (pipe) array = array.map(item => pipe.transform(item));
    return array.join(", ");
  }
}
