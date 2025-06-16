import {Pipe, PipeTransform} from '@angular/core';
import {SpecialMemberRole} from "../../special-member/models/special-member.model";

@Pipe({
  name: 'census'
})
export class CensusPipe implements PipeTransform {

  transform(value: number | undefined, options?: { role?: SpecialMemberRole, onlyPrefix?: boolean }): string {
    if (!value) return "Sin censo";
    const result = options?.role ?
      `${this.getRolePrefix(options.role)}${String(value).padStart(4, "0")}` :
      `35-105-${String(value).padStart(5, "0")}`;

    return options?.onlyPrefix ?
      result.substring(0, result.length - value.toString().length) : result;
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
