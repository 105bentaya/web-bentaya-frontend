import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hour'
})
export class HourPipe implements PipeTransform {

  transform(minutes: number, includeDays = false): string {
    if (includeDays) {
      const days = Math.floor(minutes / (60 * 24));
      let remainingMinutes = minutes % (60 * 24);
      const hours = Math.floor(remainingMinutes / 60);
      remainingMinutes = remainingMinutes % 60;

      let result = "";
      if (days > 0) result = `${days}d `;
      result += `${hours}h`;
      if (remainingMinutes > 0) {
        return result + ` ${remainingMinutes}m`;
      }
      return result;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${hours}h`;
  }
}
