import {Pipe, PipeTransform} from '@angular/core';
import {GroupPipe} from "./group.pipe";

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {

  transform(role: string, userGroup?: number): string {
    switch (role) {
      case "ROLE_USER":
        return "USUARIO";
      case "ROLE_SCOUTER": {
        const userGroupName = userGroup ? ` ${new GroupPipe().transform(userGroup).toUpperCase()}` : '';
        return "SCOUTER" + userGroupName;
      }
      case "ROLE_GROUP_SCOUTER":
        return "SCOUTER DE GRUPO";
      case "ROLE_EDITOR":
        return "EDITOR";
      case "ROLE_ADMIN":
        return "ADMINISTRADOR";
      case "ROLE_TRANSACTION":
        return "TRANSACCIONES";
      case "ROLE_FORM":
        return "PREINSCRIPCIONES";
      case "ROLE_SCOUT_CENTER_REQUESTER":
        return "SOLICITANTE CENTRO SCOUTS";
      case "ROLE_SCOUT_CENTER_MANAGER":
        return "GESTOR CENTROS SCOUT";
      default:
        return role;
    }
  }
}
