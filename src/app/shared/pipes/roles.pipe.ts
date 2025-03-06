import {Pipe, PipeTransform} from '@angular/core';
import {roles, UserRole} from "../../features/users/models/role.model";
import {RolePipe} from "./role.pipe";

@Pipe({
  name: 'roles',
  standalone: true
})
export class RolesPipe implements PipeTransform {

  private readonly rolePipe = new RolePipe();

  transform(roleIds: UserRole[], byId = false, userGroup?: string): string {
    return roleIds
      .map(role => this.roleToString(role, byId, userGroup))
      .sort((a, b) => a.localeCompare(b))
      .join(", ");
  }

  roleToString(roleProperty: UserRole, byId: boolean, userGroup?: string): string {
    const roleName = byId ?
      roles.find(role => role.id == roleProperty)?.name! :
      roleProperty;
    return this.rolePipe.transform(roleName, userGroup);
  }
}
