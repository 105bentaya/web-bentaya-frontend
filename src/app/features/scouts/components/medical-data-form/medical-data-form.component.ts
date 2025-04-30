import {Component, inject, input, OnInit, output} from '@angular/core';
import {BloodType, InsuranceHolder, Scout} from "../../models/member.model";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Select} from "primeng/select";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Button} from "primeng/button";
import ScoutHelper from "../../scout.util";
import {idTypes} from "../../../../shared/constant";
import {ScoutMedicalForm} from "../../models/member-form.model";
import {ScoutService} from "../../services/scout.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-medical-data-form',
  imports: [
    SaveButtonsComponent,
    FormTextAreaComponent,
    FloatLabel,
    ReactiveFormsModule,
    Accordion,
    AccordionPanel,
    AccordionContent,
    AccordionHeader,
    Select,
    InputText,
    InputGroup,
    InputGroupAddon,
    Button
  ],
  providers: [AccordionPanel],
  templateUrl: './medical-data-form.component.html',
  styleUrl: './medical-data-form.component.scss'
})
export class MedicalDataFormComponent implements OnInit {

  protected formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);
  private readonly scoutService = inject(ScoutService);

  protected readonly idTypes = idTypes;
  protected readonly bloodTypeOptions: { value: BloodType, label: string }[] = [
    {value: "NA", label: "Sin especificar"},
    {value: "O_NEGATIVE", label: "O-"},
    {value: "O_POSITIVE", label: "O+"},
    {value: "A_NEGATIVE", label: "A-"},
    {value: "A_POSITIVE", label: "A+"},
    {value: "B_NEGATIVE", label: "B-"},
    {value: "B_POSITIVE", label: "B+"},
    {value: "AB_NEGATIVE", label: "AB-"},
    {value: "AB_POSITIVE", label: "AB+"}
  ];
  protected contactOptions!: { label: string, value: "SELF" | "OTHER" | number }[];

  initialData = input.required<Scout>();
  protected onEditionStop = output<void | Scout>();
  protected loading: boolean = false;

  ngOnInit() {
    this.contactOptions = this.initialData().scoutInfo!.contactList.map((contact, index) => ({
      label: `${contact.relationship ?? 'Familiar ' + String(index + 1)}  - ${contact.name}`,
      value: contact.id
    }));
    this.contactOptions.unshift({label: 'Persona Asociada', value: "SELF"});
    this.contactOptions.push({label: "Otro", value: "OTHER"});

    this.formHelper.createForm({
      foodIntolerances: [this.medicalData.foodIntolerances, Validators.maxLength(65535)],
      foodAllergies: [this.medicalData.foodAllergies, Validators.maxLength(65535)],
      foodProblems: [this.medicalData.foodProblems, Validators.maxLength(65535)],
      foodDiet: [this.medicalData.foodDiet, Validators.maxLength(65535)],
      foodMedication: [this.medicalData.foodMedication, Validators.maxLength(65535)],
      medicalIntolerances: [this.medicalData.medicalIntolerances, Validators.maxLength(65535)],
      medicalAllergies: [this.medicalData.medicalAllergies, Validators.maxLength(65535)],
      medicalDiagnoses: [this.medicalData.medicalDiagnoses, Validators.maxLength(65535)],
      medicalPrecautions: [this.medicalData.medicalPrecautions, Validators.maxLength(65535)],
      medicalMedications: [this.medicalData.medicalMedications, Validators.maxLength(65535)],
      medicalEmergencies: [this.medicalData.medicalEmergencies, Validators.maxLength(65535)],
      addictions: [this.medicalData.addictions, Validators.maxLength(65535)],
      tendencies: [this.medicalData.tendencies, Validators.maxLength(65535)],
      records: [this.medicalData.records, Validators.maxLength(65535)],
      bullyingProtocol: [this.medicalData.bullyingProtocol, Validators.maxLength(65535)],
      socialSecurityNumber: [this.medicalData.socialSecurityNumber, Validators.maxLength(255)],
      socialSecurityHolder: [this.setInsuranceHolder(this.medicalData.socialSecurityNumber, this.medicalData.socialSecurityHolder), this.insuranceValidator('socialSecurityNumber')],
      socialSecurityHolderData: this.createInsuranceHolderData("socialSecurityHolder"),
      privateInsuranceNumber: [this.medicalData.privateInsuranceNumber, Validators.maxLength(255)],
      privateInsuranceEntity: [this.medicalData.privateInsuranceEntity, [this.insuranceValidator('privateInsuranceNumber'), Validators.maxLength(255)]],
      privateInsuranceHolder: [this.setInsuranceHolder(this.medicalData.privateInsuranceNumber, this.medicalData.privateInsuranceHolder), this.insuranceValidator('privateInsuranceNumber')],
      privateInsuranceHolderData: this.createInsuranceHolderData("privateInsuranceHolder"),
      bloodType: [this.medicalData.bloodType, Validators.required]
    });

    this.disableInsuranceIdDocs('socialSecurityHolderData');
    this.disableInsuranceIdDocs('privateInsuranceHolderData');
  }

  private createInsuranceHolderData(holder: string) {
    const medicalData: any = this.medicalData;

    return this.formBuilder.group({
      name: [medicalData[holder]?.name, [this.insuranceHolderValidator(holder), Validators.maxLength(255)]],
      surname: [medicalData[holder]?.surname, [this.insuranceHolderValidator(holder), Validators.maxLength(255)]],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, medicalData[holder]?.idDocument),
      phone: [medicalData[holder]?.phone, Validators.maxLength(255)],
      email: [medicalData[holder]?.email, [Validators.email, Validators.maxLength(255)]]
    });
  }

  private setInsuranceHolder(number: string | undefined, holder: InsuranceHolder | undefined) {
    if (!number) {
      return null;
    }
    if (!holder) {
      return "SELF";
    }
    if (holder.contact) {
      return holder.contact.id;
    }
    return "OTHER";
  }

  private disableInsuranceIdDocs(group: string) {
    const socialInsuranceHolder = this.formHelper.getFormGroupControl(group, 'idDocument');
    if (!socialInsuranceHolder.get("idType")?.value) {
      socialInsuranceHolder.get("number")!.disable();
    }
  }

  protected onIdTypeChange(group: string) {
    const numberControl = this.formHelper.getFormGroupControl(group, 'idDocument').get("number")!;
    numberControl.enable();
    numberControl.updateValueAndValidity();
  }

  protected onIdTypeClear(group: string) {
    const numberControl = this.formHelper.getFormGroupControl(group, 'idDocument').get("number")!;
    numberControl.setValue(undefined);
    numberControl.disable();
  }

  private insuranceValidator(insurance: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const insuranceControl = this.formHelper.get(insurance);
      return insuranceControl?.value && !control.value ? {required: true} : null;
    };
  }

  private insuranceHolderValidator(insuranceHolder: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const insuranceControl = this.formHelper.get(insuranceHolder);
      return insuranceControl?.value === 'OTHER' && !control.value ? {required: true} : null;
    };
  }

  protected onSubmit() {
    if (this.formHelper.validateAll()) {
      const formValue = {...this.formHelper.value};
      this.createFormInsuranceHolder(formValue, "socialSecurity");
      this.createFormInsuranceHolder(formValue, "privateInsurance");

      const form = formValue as ScoutMedicalForm;

      this.loading = true;
      this.scoutService.updateMedicalData(this.initialData().id, form)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => this.onEditionStop.emit(result));
    }
  }

  private createFormInsuranceHolder(formValue: any, controlPrefix: string) {
    const numberControl = `${controlPrefix}Number`;
    const holderControl = `${controlPrefix}Holder`;
    const dataControl = `${controlPrefix}HolderData`;

    if (formValue[numberControl]) {
      if (formValue[holderControl] == "SELF") {
        formValue[holderControl] = null;
      } else if (formValue[holderControl] == "OTHER") {
        formValue[holderControl] = formValue[dataControl];
        if (!formValue[holderControl].idDocument.idType || !formValue[holderControl].idDocument.number) {
          formValue[holderControl].idDocument = null;
        }
      } else {
        formValue[holderControl] = {
          contactId: formValue[holderControl]
        };
      }
    } else {
      formValue[holderControl] = null;
    }
    delete formValue[dataControl];
  }

  protected clearSocialSecurity() {
    this.formHelper.get('socialSecurityNumber')?.reset();
    this.formHelper.get('socialSecurityHolder')?.reset();
    this.formHelper.get('socialSecurityHolderData')?.reset();
  }

  protected clearPrivateInsurance() {
    this.formHelper.get('privateInsuranceEntity')?.reset();
    this.formHelper.get('privateInsuranceNumber')?.reset();
    this.formHelper.get('privateInsuranceHolder')?.reset();
    this.formHelper.get('privateInsuranceHolderData')?.reset();
  }

  get medicalData() {
    return this.initialData().scoutInfo!.medicalData;
  }
}
