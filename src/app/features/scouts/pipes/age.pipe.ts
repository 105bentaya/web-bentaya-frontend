import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: Date | undefined, fullAge = true): string {
    if (!value) return "Sin especificar";

    const birth = new Date(value);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    return fullAge ? `${years} años ${months} meses ${days} días` : `${years} años`;
  }
}
