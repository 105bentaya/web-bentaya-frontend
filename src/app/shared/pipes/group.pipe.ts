import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'group',
  standalone: true
})
export class GroupPipe implements PipeTransform {

  transform(groupId: number): string {
    switch (groupId) {
      case 1:
        return "Garajonay";
      case 2:
        return "Waigunga";
      case 3:
        return "Baobab";
      case 4:
        return "Autindana";
      case 5:
        return "Arteteifac";
      case 6:
        return "Aridane";
      case 7:
        return "Idafe";
      case 0:
        return "Grupo";
      case 8:
        return "Scouters";
      default:
        return "Ninguna Unidad";
    }
  }
}
