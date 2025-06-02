import {Pipe, PipeTransform} from '@angular/core';
import {ScoutInfo} from "../../features/scouts/models/scout.model";

@Pipe({
  name: 'scoutYear',
  standalone: true
})
export class ScoutYearPipe implements PipeTransform {

  private readonly groups: { [key: string]: { [key: number]: string }; } = {
    "CASTORES": {7: '1º', 8: '2º'},
    "LOBATOS": {9: '1º', 10: '2º', 11: '3º'},
    "SCOUTS": {12: '1º', 13: '2º', 14: '3º'},
    "ESCULTAS": {15: '1º', 16: '2º', 17: '3º'},
    "ROVERS": {18: '1º', 19: '2º', 20: '3º', 21: '4º'},
  };

  private readonly ages: any = {
    7: "1º Castores",
    8: "2º Castores",
    9: "1º Lobatos",
    10: "2º Lobatos",
    11: "3º Lobatos",
    12: "1º Scout",
    13: "2º Scout",
    14: "3º Scout",
    15: "1º Esculta",
    16: "2º Esculta",
    17: "3º Esculta",
    18: "1º Rover",
    19: "2º Rover",
    20: "3º Rover",
    21: "4º Rover"
  };

  transform(value: number, scoutInfo?: ScoutInfo): string {
    if (scoutInfo) {
      if (scoutInfo?.scoutType === "SCOUT") {
        return this.groups[scoutInfo.group!.section!][value] ?? 'Fuera de Edad';
      } else {
        return "-";
      }
    } else {
      return this.ages[value] ?? "Fuera de Edad";
    }
  }
}
