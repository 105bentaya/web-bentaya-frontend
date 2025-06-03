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
      name: [preScout.name, [Validators.required, Validators.maxLength(255)]],
      feltName: [null, Validators.maxLength(255)],
      surname: [preScout.surname, [Validators.required, Validators.maxLength(255)]],
      birthday: [preScout.birthday ? new Date(preScout.birthday) : null, Validators.required],
      gender: [preScout.gender, [Validators.required, Validators.maxLength(255)]],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, {idType: undefined!, number: preScout.dni!}),

      address: [null, Validators.maxLength(255)],
      city: [null, Validators.maxLength(255)],
      province: [null, Validators.maxLength(255)],

      phone: [preScout.phone, Validators.maxLength(255)],
      landline: [null, Validators.maxLength(255)],
      email: [preScout.email, [Validators.maxLength(255), Validators.email]],
      shirtSize: [preScout.size, Validators.maxLength(255)],
      residenceMunicipality: [preScout.residenceMunicipality, Validators.maxLength(255)],

      // dni?: string;
      // groupId: [null, Validators.requiredIf],
      //
      //
      // section?: string;
      // yearAndSection?: string;
      // medicalData?: string;
      // parentsName?: string;
      // parentsSurname?: string;
      // relationship?: string;
      // phone: string;
      // email: string;
      // comment: string;
      // priority: number;
      // priorityInfo?: string;
      // creationDate?: Date;
      // age?: string;
      // assignation?: PreScoutAssignation;
      // size?: string;
      // inscriptionYear?: number;
    });
  }


  fromPreScout(preScout: PreScout) {

  }

}
