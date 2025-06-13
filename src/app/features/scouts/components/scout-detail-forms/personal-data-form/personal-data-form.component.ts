import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormHelper} from "../../../../../shared/util/form-helper";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Scout} from "../../../models/scout.model";
import ScoutHelper from "../../../scout.util";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {DatePicker} from "primeng/datepicker";
import {Select} from "primeng/select";
import {genders, shirtSizes, yesNoOptions} from "../../../../../shared/constant";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {ScoutService} from "../../../services/scout.service";
import {finalize} from "rxjs";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {PersonalDataForm} from "../../../models/scout-form.model";
import {IdDocumentFormComponent} from "../../id-document-form/id-document-form.component";
import {SelectButton} from "primeng/selectbutton";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-personal-data-form',
  imports: [
    SaveButtonsComponent,
    FormsModule,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    DatePicker,
    Select,
    FormTextAreaComponent,
    IdDocumentFormComponent,
    SelectButton
  ],
  templateUrl: './personal-data-form.component.html',
  styleUrl: './personal-data-form.component.scss'
})
export class PersonalDataFormComponent implements OnInit {

  protected readonly formHelper = new FormHelper();
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly scoutService = inject(ScoutService);
  protected readonly confirmationService = inject(ConfirmationService);

  protected readonly genders = genders;
  protected readonly shirtSizes = shirtSizes;
  protected readonly yesNoOptions = yesNoOptions;

  public initialData = input.required<Scout>();
  protected onEditionStop = output<void | Scout>();

  protected loading: boolean = false;

  ngOnInit() {
    this.createEditForm();
  }

  private createEditForm() {
    const personalData = this.initialData().personalData;

    this.formHelper.createForm({
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, personalData.idDocument),
      observations: [personalData.observations, Validators.maxLength(65535)],
      surname: [personalData.surname, [Validators.required, Validators.maxLength(255)]],
      name: [personalData.name, [Validators.required, Validators.maxLength(255)]],
      feltName: [personalData.feltName, Validators.maxLength(255)],
      birthday: [personalData.birthday ? new Date(personalData.birthday) : null, Validators.required],
      birthplace: [personalData.birthplace, Validators.maxLength(255)],
      birthProvince: [personalData.birthProvince, Validators.maxLength(255)],
      nationality: [personalData.nationality, Validators.maxLength(255)],
      address: [personalData.address, Validators.maxLength(255)],
      city: [personalData.city, Validators.maxLength(255)],
      province: [personalData.province, Validators.maxLength(255)],
      phone: [personalData.phone, Validators.maxLength(255)],
      landline: [personalData.landline, Validators.maxLength(255)],
      email: [personalData.email, [Validators.maxLength(255), Validators.email]],
      shirtSize: [personalData.shirtSize, Validators.maxLength(255)],
      residenceMunicipality: [personalData.residenceMunicipality, Validators.maxLength(255)],
      gender: [personalData.gender, [Validators.required, Validators.maxLength(255)]],
      imageAuthorization: [personalData.imageAuthorization, Validators.required],
      largeFamily: [personalData.largeFamily, Validators.required]
    });
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const form: PersonalDataForm = {...this.formHelper.value,};

      form.birthday = DateUtils.toLocalDate(form.birthday);
      if (form.idDocument && (!form.idDocument.idType || !form.idDocument.number)) {
        delete form.idDocument;
      }
      if (form.email) {
        form.email = form.email.toLowerCase();
      }
      const originalEmail = this.initialData().personalData.email;

      if (originalEmail !== form.email && this.initialData().usernames.includes(originalEmail)) {
        this.confirmationService.confirm({
          message: "El correo electrónico de esta asociada está vinculado a un usuario. " +
            "Tras cambiarlo, se eliminará el acceso de dicho usuario. ¿Desea continuar?",
          accept: () => this.updateData(form),
          reject: () => this.loading = false
        });
      } else {
        this.updateData(form);
      }
    }
  }

  private updateData(form: PersonalDataForm) {
    this.scoutService.updatePersonalData(this.initialData().id, form)
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => this.onEditionStop.emit(result));
  }

}
