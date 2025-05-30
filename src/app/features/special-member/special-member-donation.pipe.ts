import { Pipe, PipeTransform } from '@angular/core';
import {DonationType} from "./models/special-member.model";

@Pipe({
  name: 'specialMemberDonation'
})
export class SpecialMemberDonationPipe implements PipeTransform {

  transform(value: DonationType): string {
    switch (value) {
      case "ECONOMIC":
        return "Económica";
      case "IN_KIND":
        return "En especies";
    }
  }

}
