import {Pipe, PipeTransform} from '@angular/core';
import {SpecialMemberRole} from "../../special-member/models/special-member.model";

@Pipe({
  name: 'census'
})
export class CensusPipe implements PipeTransform {

  transform(value: number | undefined, specialRole?: SpecialMemberRole): string {
    if (!value) return "Sin censo";
    if (specialRole) {
      return `${this.getRolePrefix(specialRole)}${String(value).padStart(4, "0")}`;
    }
    return `35-105-${String(value).padStart(5, "0")}`;
  }

  private getRolePrefix(specialRole: SpecialMemberRole) {
    if (specialRole === "ACKNOWLEDGEMENT") {
      return "R";
    } else if (specialRole) {
      return specialRole[0];
    }
    return "";
  }
}
