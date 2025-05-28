import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'census'
})
export class CensusPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (!value) return "Sin censo";
    return `35-105-${String(value).padStart(5, "0")}`;
  }
}
