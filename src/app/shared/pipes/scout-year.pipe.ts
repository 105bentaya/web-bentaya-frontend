import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'scoutYear',
  standalone: true
})
export class ScoutYearPipe implements PipeTransform {

  private groups: any = {
    1: {7: '1º', 8: '2º'},
    2: {9: '1º', 10: '2º', 11: '3º'},
    3: {9: '1º', 10: '2º', 11: '3º'},
    4: {12: '1º', 13: '2º', 14: '3º'},
    5: {12: '1º', 13: '2º', 14: '3º'},
    6: {15: '1º', 16: '2º', 17: '3º'},
    7: {18: '1º', 19: '2º', 20: '3º', 21: '4º'},
  };

  private ages: any = {
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

  transform(value: number, group?: number) {
    if (group) {
      const scoutGroup = this.groups[group];
      return scoutGroup?.[value] ? scoutGroup[value] : 'Fuera de Edad';
    } else {
      return this.ages[value] || "Fuera de Edad";
    }
  }
}
