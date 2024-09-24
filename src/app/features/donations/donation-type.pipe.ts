import {Pipe, PipeTransform} from '@angular/core';
import {Donation} from "./model/donation.model";

@Pipe({
  name: 'donationType',
  standalone: true
})
export class DonationTypePipe implements PipeTransform {

  transform(donation: Donation): unknown {
    switch (donation.frequency) {
      case "BIANNUAL":
        return "SEMESTRAL";
      case "MONTHLY":
        return "MENSUAL";
      case "QUARTERLY":
        return "TRIMESTRAL";
      case "YEARLY":
        return "ANUAL";
      case "SINGLE": {
        switch (donation.singleDonationPaymentType) {
          case "TPV":
            return "PUNTUAL POR TPV";
          case "IBAN":
            return "PUNTUAL DOMICILIADA";
          default:
            return "PUNTUAL POR INGRESO";
        }
      }
    }
  }

}
