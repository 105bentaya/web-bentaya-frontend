import { Pipe, PipeTransform } from '@angular/core';
import {SpecialMemberRole} from "./models/special-member.model";

@Pipe({
  name: 'specialRole'
})
export class SpecialRolePipe implements PipeTransform {

  transform(value: SpecialMemberRole): unknown {
    switch (value) {
      case "FOUNDER":
        return "Fundadora";
      case "HONOUR":
        return "Honor";
      case "ACKNOWLEDGEMENT":
        return "Reconocimiento";
      case "PROTECTOR":
        return "Protectora";
      case "DONOR":
        return "Donante";
    }
  }

}
