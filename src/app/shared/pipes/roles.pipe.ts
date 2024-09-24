import {Pipe, PipeTransform} from '@angular/core';
import {roles} from "../../features/users/models/role.model";
import {RolePipe} from "./role.pipe";

@Pipe({
  name: 'roles',
  standalone: true
})
export class RolesPipe implements PipeTransform {

  private rolePipe = new RolePipe();

  transform(roleIds: string[], byId = false, userGroup?: number): string {
    return roleIds
      .map(role => this.roleToString(role, byId, userGroup))
      .sort((a, b) => a.localeCompare(b))
      .join(", ");
  }

  roleToString(roleProperty: string, byId: boolean, userGroup?: number): string {
    const roleName = byId ?
      roles.find(role => role.id == roleProperty)?.name! :
      roleProperty;
    return this.rolePipe.transform(roleName, userGroup);
  }
}
