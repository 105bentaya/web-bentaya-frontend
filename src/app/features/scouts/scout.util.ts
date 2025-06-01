import {AbstractControl, FormBuilder, ValidationErrors, ValidatorFn} from "@angular/forms";
import {IdentificationDocument, IdType} from "./models/scout.model";

export default class ScoutHelper {

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
