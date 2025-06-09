import {Component, inject} from '@angular/core';
import {PreScout} from "../../../scout-forms/models/pre-scout.model";
import ScoutHelper from "../../scout.util";
import {FormHelper} from "../../../../shared/util/form-helper";
import {PreScoutAssignation} from "../../../scout-forms/models/pre-scout-assignation.model";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-scout-form',
  imports: [],
  templateUrl: './new-scout-form.component.html',
  styleUrl: './new-scout-form.component.scss'
})
export class NewScoutFormComponent {

  protected readonly formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);

  createForm(preScout: PreScout) {
    //si hasBeenInGroup, buscar scout y empezar por ahí.

    this.formHelper.createForm({
      //personal
      name: [preScout.name, [Validators.required, Validators.maxLength(255)]],
      feltName: [null, Validators.maxLength(255)],
      surname: [preScout.surname, [Validators.required, Validators.maxLength(255)]],
      birthday: [preScout.birthday ? new Date(preScout.birthday) : null, Validators.required],
      gender: [preScout.gender, [Validators.required, Validators.maxLength(255)]],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, {idType: undefined!, number: preScout.dni!}),

      address: [null, Validators.maxLength(255)],
      city: [null, Validators.maxLength(255)],
      province: [null, Validators.maxLength(255)],
      residenceMunicipality: [null, Validators.maxLength(255)],

      phone: [null, Validators.maxLength(255)],
      landline: [null, Validators.maxLength(255)],
      email: [null, [Validators.maxLength(255), Validators.email]],
      shirtSize: [preScout.size, Validators.maxLength(255)],

      //contact //EL DONANTE, EL OTRO LO AÑADES MAS TARDE
      contact: this.formBuilder.group({
        name: [preScout.parentsName, Validators.maxLength(255)],
        surname: [preScout.parentsSurname, Validators.maxLength(255)],
        relationship: [preScout.relationship, Validators.maxLength(255)],
        phone: [preScout.phone, Validators.maxLength(255)],
        email: [preScout.email, [Validators.maxLength(255), Validators.email]],
        studies: [null, Validators.maxLength(255)],
        profession: [null, Validators.maxLength(255)],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder)
      }),

      //economic, ASEGURARSE QUE EL TITULAR Y NIF DEL TITULAR CORRESPONDE CON EL CONTACTO
      iban: [null, [Validators.required, ScoutHelper.ibanValidator]],
      bank: [null, [Validators.required, Validators.maxLength(255)]],

      //medical JUMP TO MEDICAL FORM

      // groupId: [null, Validators.requiredIf],
      //
      //
      // section?: string;
      // yearAndSection?: string;

      // medicalData?: string;

      // firstActivityDate?: Date; //fecha de alta
    });
  }


  fromPreScout(preScout: PreScout) {

  }

}
