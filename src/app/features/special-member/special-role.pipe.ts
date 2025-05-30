import { Pipe, PipeTransform } from '@angular/core';
import {SpecialMemberRole} from "./models/special-member.model";

@Pipe({
  name: 'specialRole'
})
export class SpecialRolePipe implements PipeTransform {

  transform(value: SpecialMemberRole, complete = false): string {
    switch (value) {
      case "FOUNDER":
        return complete ? "Asociada Fundadora" : "Fundadora";
      case "HONOUR":
        return complete ? "Asociada de Honor" : "Honor";
      case "ACKNOWLEDGEMENT":
        return "Reconocimiento";
      case "PROTECTOR":
        return complete ? "Asociada Protectora" : "Protectora";
      case "DONOR":
        return "Donante";
    }
  }

}
