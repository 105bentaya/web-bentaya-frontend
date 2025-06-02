import {Component, inject, input, OnInit, output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {Scout, ScoutContact} from "../../../models/scout.model";
import {idTypes, personTypes, yesNoOptions} from "../../../../../shared/constant";
import ScoutHelper from "../../../scout.util";
import {SelectButton} from "primeng/selectbutton";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {Button} from "primeng/button";
import {finalize} from "rxjs";
import {ScoutService} from "../../../services/scout.service";
import {ScoutContactForm} from "../../../models/scout-form.model";
import {AlertService} from "../../../../../shared/services/alert-service.service";

@Component({
  selector: 'app-contact-data-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SaveButtonsComponent,
    SelectButton,
    FloatLabel,
    InputText,
    Select,
    FormTextAreaComponent,
    Button
  ],
  templateUrl: './contact-data-form.component.html',
  styleUrl: './contact-data-form.component.scss'
})
export class ContactDataFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);
  protected readonly formHelper = new FormHelper();

  protected readonly personTypes = personTypes;
  protected readonly relationshipOptions = ["Madre", "Padre", "Tutor", "Tutora"];
  protected readonly idTypes = idTypes;
  protected readonly yesNoOptions = yesNoOptions;

  initialData = input.required<Scout>();
  protected onEditionStop = output<void | Scout>();

  protected loading: boolean = false;

  ngOnInit() {
    this.formHelper.createForm({
      contactList: this.formBuilder.array(
        this.initialData() ? this.initialData().contactList.map(data => this.createContact(data)) : [this.createContact()],
        [Validators.minLength(1), Validators.maxLength(3)]
      )
    });
  }

  private createContact(data?: ScoutContact) {
    const control = this.formBuilder.group({
      id: [data?.id ?? null],
      personType: [data?.personType ?? "REAL", Validators.required],
      companyName: [data?.companyName ?? null, [this.companyNameValidator, Validators.maxLength(255)]],
      name: [data?.name ?? null, [Validators.required, Validators.maxLength(255)]],
      surname: [data?.surname ?? null, Validators.maxLength(255)],
      relationship: [data?.relationship ?? null, Validators.maxLength(255)],
      phone: [data?.phone ?? null, Validators.maxLength(255)],
      email: [data?.email ?? null, [Validators.maxLength(255), Validators.email]],
      studies: [data?.studies ?? null, Validators.maxLength(255)],
      profession: [data?.profession ?? null, Validators.maxLength(255)],
      observations: [data?.observations ?? null, Validators.maxLength(65535)],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, data?.idDocument),
      donor: [data?.donor ?? null, Validators.required],
    });

    if (!this.getIdDocumentControl(control, "idType")?.value) {
      this.onIdTypeClear(control);
    }

    return control;
  }

  private readonly companyNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !this.contactIsReal(control.parent) && !control.value ? {required: true} : null;
  };

  protected submit() {
    if (this.formHelper.validateAll()) {
      const form: ScoutContactForm[] = [...this.formHelper.value.contactList];
      form.forEach(contact => {
        if (contact.personType === "REAL") {
          delete contact.companyName;
        } else {
          delete contact.profession;
          delete contact.studies;
        }

        if (contact.idDocument && (!contact.idDocument.idType || !contact.idDocument.number)) {
          delete contact.idDocument;
        }
      });

      this.loading = true;
      this.scoutService.updateScoutContacts(this.initialData().id, form)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => this.onEditionStop.emit(result));
    }
  }

  protected contactIsReal(form: any) {
    return form?.get('personType').value === "REAL";
  }

  protected getIdDocumentControl(form: any, control: any) {
    return form?.get('idDocument')?.get(control) as FormControl;
  }

  protected onIdTypeChange(form: any) {
    const numberControl = this.getIdDocumentControl(form, 'number');
    numberControl.enable();
    numberControl.updateValueAndValidity();
  }

  protected onIdTypeClear(form: any) {
    const numberControl = this.getIdDocumentControl(form, 'number');
    numberControl.setValue(undefined);
    numberControl.disable();
  }

  protected deleteContact(index: number) {
    const array = this.formHelper.getFormArray("contactList");
    const contact = array.at(index) as FormGroup;
    if (this.contactCanBeDeleted(contact)) {
      array.removeAt(index);
      if (array.length < 1) this.addContact();
    }
  }

  private contactCanBeDeleted(control: FormGroup) {
    const id = control.get("id")?.value;
    if (this.initialData() && id) {
      const privateInsurance = this.initialData().medicalData.privateInsuranceHolder?.contact?.id;
      const socialSecurity = this.initialData().medicalData.socialSecurityHolder?.contact?.id;

      if (privateInsurance === id || socialSecurity === id) {
        this.alertService.sendMessage({
          message: "No se puede eliminar a este familiar porque está asociado a un seguro de los 'Datos de Salud'. Cambie al titular del seguro para poder eliminarlo.",
          severity: "warn",
          title: "Conflicto",
          life: 10000
        });
        return false;
      }
    }
    return true;
  }

  protected addContact() {
    const array = this.formHelper.getFormArray("contactList");
    array.push(this.createContact());
    setTimeout(() => document.getElementById(`title-${array.length - 1}`)?.scrollIntoView(), 50);
  }
}
