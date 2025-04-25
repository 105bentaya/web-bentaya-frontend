import {Scout} from "./models/scout.model";
import {DatePipe} from "@angular/common";
import {BooleanPipe} from "../../shared/pipes/boolean.pipe";
import {AbstractControl, FormBuilder, ValidationErrors, ValidatorFn} from "@angular/forms";
import {IdentificationDocument, IdType} from "./models/member.model";

export default class ScoutHelper {

  static generateData(scoutList: Scout[], addSection = false) {
    const datePipe = new DatePipe("es");
    const booleanPipe = new BooleanPipe();
    return scoutList.map(scout => {
      let tempScout: { [k: string]: any } = {
        id: scout.census?.toString(),
        surname: scout.surname,
        name: scout.name,
      };
      if (addSection) {
        tempScout = {...tempScout, sect: scout.group.name};
      }
      tempScout = {
        ...tempScout,
        dni: scout.dni,
        birthday: datePipe.transform(scout.birthday, "dd/MM/y"),
        gender: scout.gender,
        municipality: scout.municipality,
        size: scout.shirtSize,
        image: booleanPipe.transform(scout.imageAuthorization),
        medical: scout.medicalData,
        progression: scout.progressions,
        observation: scout.observations
      };
      for (let i = 0; i < scout.contactList.length; i++) {
        tempScout[`c-${i}-0`] = scout.contactList[i].name;
        tempScout[`c-${i}-1`] = scout.contactList[i]?.relationship ?? "";
        tempScout[`c-${i}-2`] = scout.contactList[i]?.email ?? "";
        tempScout[`c-${i}-3`] = scout.contactList[i]?.phone ?? "";
      }
      return tempScout;
    });
  }

  static generateExcelColumns(scoutList: Scout[], addSection = false) {
    const result = ["Censo", "Apellidos", "Nombre"];
    if (addSection) {
      result.push("Unidad");
    }
    result.push("DNI o NIE", "Fecha de Nacimiento", "Género", "Municipio de Residencia", "Talla", "Uso de Imagen",
      "Datos Médicos", "Progresiones", "Observaciones de Scouter");

    const maxContacts = scoutList.reduce((w, r) => Math.max(w, r.contactList.length), 0);
    for (let i = 1; i <= maxContacts; i++) {
      result.push(`Contacto ${i} - Nombre`);
      result.push("Parentesco");
      result.push("Correo");
      result.push("Número");
    }

    return result;
  }

  static idDocumentFormGroup(formBuilder: FormBuilder, id?: IdentificationDocument) {
    return formBuilder.group({
      idType: [id?.idType ?? null],
      number: [id?.number ?? null, this.idDocumentValidator]
    });
  }

  private static readonly idDocumentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const type: IdType | undefined = control.parent?.get('idType')?.value;
    const number = control.parent?.get("number")?.value;

    if (!type && !number) return null;
    if (!type || !number) return {required: true};

    switch (type) {
      case "DNI":
        return !this.dniIsValid(number.toUpperCase()) ? {formatInvalid: true} : null;
      case "NIE":
        return !this.nieIsValid(number.toUpperCase()) ? {formatInvalid: true} : null;
      case "CIF":
        return !this.cifIsValid(number.toUpperCase()) ? {formatInvalid: true} : null;
      default:
        return null;
    }
  };

  static readonly cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/;
  static readonly controlLetters = 'JABCDEFGHI';
  static readonly letterControl = ['P', 'Q', 'R', 'S', 'W'];
  static readonly numberControl = ['A', 'B', 'E', 'H'];

  public static cifIsValid(value: string) {
    if (ScoutHelper.cifRegex.test(value)) {
      const firstLetter = value[0];
      const numbers = value.slice(1, -1);
      const controlCharacter = value.slice(-1);

      let evenSum = 0;
      let oddSum = 0;

      for (let i = 0; i < numbers.length; i++) {
        const num = parseInt(numbers[i], 10);
        if (i % 2 === 0) {
          const double = num * 2;
          oddSum += Math.floor(double / 10) + (double % 10);
        } else {
          evenSum += num;
        }
      }

      const lastNumber = 10 - ((evenSum + oddSum) % 10);
      const controlDigit = lastNumber === 10 ? 0 : lastNumber;

      const expectedLetter = ScoutHelper.controlLetters[controlDigit];
      const expectedNumber = controlDigit.toString();

      if (ScoutHelper.letterControl.includes(firstLetter)) {
        return controlCharacter === expectedLetter;
      }
      if (ScoutHelper.numberControl.includes(firstLetter)) {
        return controlCharacter === expectedNumber;
      }
      return controlCharacter === expectedLetter || controlCharacter === expectedNumber;
    }
    return false;
  }

  static readonly nieRegex = /^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

  private static nieIsValid(number: string): boolean {
    if (this.nieRegex.test(number)) {
      const nieFirstLetter = number[0];
      if (nieFirstLetter === "X") {
        return this.dniIsValid("0" + number.slice(1));
      }
      if (nieFirstLetter === "Y") {
        return this.dniIsValid("1" + number.slice(1));
      }
      if (nieFirstLetter === "Z") {
        return this.dniIsValid("2" + number.slice(1));
      }
    }
    return false;
  }

  static readonly dniRegex = /^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
  static readonly dniLetters = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];

  private static dniIsValid(number: string): boolean {
    if (this.dniRegex.test(number)) {
      const dniNumber = Number(number.slice(0, -1));
      const dniLetter = number.slice(-1);
      if (this.dniLetters[dniNumber % 23] === dniLetter) {
        return true;
      }
    }
    return false;
  }
}
