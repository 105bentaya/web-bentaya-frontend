import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sentence',
  standalone: true
})
export class SentenceCasePipe implements PipeTransform {

  transform(value: string | null | undefined) {
    return value![0].toUpperCase() + value!.substring(1).toLowerCase();
  }
}
