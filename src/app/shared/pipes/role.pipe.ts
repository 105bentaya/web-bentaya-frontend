import {Pipe, PipeTransform} from '@angular/core';
import {UserRole} from "../../features/users/models/role.model";

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {

  transform(role: UserRole, userGroup?: string): string {
    switch (role) {
      case UserRole.USER:
        return "USUARIO";
      case UserRole.SCOUTER: {
        const userGroupName = userGroup ? ` ${userGroup.toUpperCase()}` : '';
        return "SCOUTER" + userGroupName;
      }
      case UserRole.GROUP_SCOUTER:
        return "SCOUTER DE GRUPO";
      case UserRole.EDITOR:
        return "EDITOR";
      case UserRole.ADMIN:
        return "ADMINISTRADOR";
      case UserRole.TRANSACTION:
        return "TRANSACCIONES";
      case UserRole.FORM:
        return "PREINSCRIPCIONES";
      case UserRole.SCOUT_CENTER_REQUESTER:
        return "SOLICITANTE CENTRO SCOUTS";
      case UserRole.SCOUT_CENTER_MANAGER:
        return "GESTOR CENTROS SCOUT";
      default:
        return role;
    }
  }
}
