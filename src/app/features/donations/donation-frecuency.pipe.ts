import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'donationFrequency',
  standalone: true
})
export class DonationFrequencyPipe implements PipeTransform {

  transform(value: string, adjective = false): string {
    switch (value) {
      case "YEARLY":
        return adjective ? 'Anual' : 'año';
      case "BIANNUAL":
        return adjective ? 'Semestral' : 'seis meses';
      case "QUARTERLY":
        return adjective ? 'Trimestral' : 'tres meses';
      case "MONTHLY":
        return adjective ? 'Mensual' : 'mes';
      case "SINGLE":
        return 'Donación puntual';
    }
    return value;
  }

}
