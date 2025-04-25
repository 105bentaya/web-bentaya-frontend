import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {JuridicalPersonalData, Member, MemberType, RealPersonalData} from "../../models/member.model";
import ScoutHelper from "../../scout.util";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {SelectButton} from "primeng/selectbutton";
import {DatePicker} from "primeng/datepicker";
import {Select} from "primeng/select";
import {genders, idTypes, shirtSizes} from "../../../../shared/constant";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {ScoutService} from "../../services/scout.service";
import {finalize} from "rxjs";
import {DateUtils} from "../../../../shared/util/date-utils";
import {PersonalDataForm} from "../../models/member-form.model";

@Component({
  selector: 'app-personal-data-form',
  imports: [
    SaveButtonsComponent,
    FormsModule,
    FloatLabel,
    InputText,
    SelectButton,
    ReactiveFormsModule,
    DatePicker,
    Select,
    FormTextAreaComponent
  ],
  templateUrl: './personal-data-form.component.html',
  styleUrl: './personal-data-form.component.scss'
})
export class PersonalDataFormComponent implements OnInit {

  protected readonly formHelper = new FormHelper();
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly scoutService = inject(ScoutService);

  protected readonly genders = genders;
  protected readonly shirtSizes = shirtSizes;
  protected readonly idTypes = idTypes;

  protected readonly options: ({ label: string; value: MemberType })[] = [
    {label: "Real", value: "REAL"},
    {label: "Jurídica", value: "JURIDICAL"}
  ];

  public initialData = input<Member>();
  protected onEditionStop = output<void | Member>();

  protected loading: boolean = false;

  ngOnInit() {
    if (this.initialData()) {
      this.createEditForm();
    } else {
      this.createNewForm();
    }
  }

  private createEditForm() {
    const member = this.initialData()!;

    if (member.type == "REAL") {
      const memberData = this.initialData()!.personalData as RealPersonalData;
      this.formHelper.createForm({
        type: [member.type, Validators.required],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, memberData.idDocument),
        observations: [member.personalData.observations, Validators.maxLength(65535)],
        realData: this.formBuilder.group({
          surname: [memberData.surname, [Validators.required, Validators.maxLength(255)]],
          name: [memberData.name, [Validators.required, Validators.maxLength(255)]],
          feltName: [memberData.feltName, Validators.maxLength(255)],
          birthday: [memberData.birthday ? new Date(memberData.birthday) : null, Validators.required],
          birthplace: [memberData.birthplace, Validators.maxLength(255)],
          birthProvince: [memberData.birthProvince, Validators.maxLength(255)],
          nationality: [memberData.nationality, Validators.maxLength(255)],
          address: [memberData.address, Validators.maxLength(255)],
          city: [memberData.city, Validators.maxLength(255)],
          province: [memberData.province, Validators.maxLength(255)],
          phone: [memberData.phone, Validators.maxLength(255)],
          landline: [memberData.landline, Validators.maxLength(255)],
          email: [memberData.email, [Validators.maxLength(255), Validators.email]],
          shirtSize: [memberData.shirtSize, Validators.maxLength(255)],
          residenceMunicipality: [memberData.residenceMunicipality, Validators.maxLength(255)],
          gender: [memberData.gender, [Validators.required, Validators.maxLength(255)]]
        })
      });
    } else {
      const memberData = this.initialData()!.personalData as JuridicalPersonalData;
      this.formHelper.createForm({
        type: [member.type, Validators.required],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, memberData.idDocument),
        observations: [member.personalData.observations, Validators.maxLength(65535)],
        juridicalData: [this.formBuilder.group({
          companyName: [memberData.companyName, [Validators.required, Validators.maxLength(255)]],
          name: [memberData.representative.name, [Validators.required, Validators.maxLength(255)]],
          surname: [memberData.representative.surname, [Validators.required, Validators.maxLength(255)]],
          email: [memberData.representative.email, Validators.maxLength(255)],
          phone: [memberData.representative.phone, Validators.required],
          landline: [memberData.representative.landline, [Validators.required, Validators.maxLength(255)]],
          idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, memberData.representative.idDocument)
        }), Validators.required]
      });
    }

    if (!this.formHelper.getFormGroupControl('idDocument', 'idType').value) {
      this.formHelper.getFormGroupControl('idDocument', 'number').disable();
    }
  }

  private createNewForm() {
    this.formHelper.createForm({
      type: [null, Validators.required],
      idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder),
      observations: [null, Validators.maxLength(65535)],
      realData: this.formBuilder.group({
        surname: [null, [Validators.required, Validators.maxLength(255)]],
        name: [null, [Validators.required, Validators.maxLength(255)]],
        feltName: [null, Validators.maxLength(255)],
        birthday: [null, Validators.required],
        birthplace: [null, [Validators.required, Validators.maxLength(255)]],
        birthProvince: [null, Validators.maxLength(255)],
        nationality: [null, Validators.maxLength(255)],
        address: [null, Validators.maxLength(255)],
        city: [null, Validators.maxLength(255)],
        province: [null, Validators.maxLength(255)],
        phone: [null, Validators.maxLength(255)],
        landline: [null, Validators.maxLength(255)],
        email: [null, [Validators.maxLength(255), Validators.email]],
        shirtSize: [null, Validators.maxLength(255)],
        residenceMunicipality: [null, Validators.maxLength(255)],
        gender: [null, [Validators.required, Validators.maxLength(255)]],
      }),
      juridicalData: this.formBuilder.group({
        companyName: [null, [Validators.required, Validators.maxLength(255)]],
        name: [null, [Validators.required, Validators.maxLength(255)]],
        surname: [null, [Validators.required, Validators.maxLength(255)]],
        email: [null, Validators.maxLength(255)],
        phone: [null, Validators.required],
        landline: [null, [Validators.required, Validators.maxLength(255)]],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder)
      })
    }, {validators: this.dataValidator});
  }

  private readonly dataValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const type: MemberType | undefined = control.get('type')?.value;

    if (!type) return null;
    if (type == "REAL" && !control.get("realData")?.value) return {dataRequired: true};
    if (type == "JURIDICAL" && !control.get("juridicalData")?.value) return {dataRequired: true};

    return null;
  };

  protected submit() {
    if (this.formHelper.validateAll()) {
      const form: PersonalDataForm = {...this.formHelper.value};
      if (form.type === "REAL") {
        delete form.juridicalData;
        form.realData!.birthday = DateUtils.toLocalDate(form.realData!.birthday);
      } else {
        delete form.realData;
      }

      if (form.idDocument && (!form.idDocument.idType || !form.idDocument.number)) {
        delete form.idDocument;
      }

      this.loading = true;
      if (this.initialData()) {
        this.scoutService.updatePersonalData(this.initialData()!.id, form)
          .pipe(finalize(() => this.loading = false))
          .subscribe(result => this.onEditionStop.emit(result));
      }
    }
  }

  protected onIdTypeChange() {
    const numberControl = this.formHelper.getFormGroupControl('idDocument', 'number');
    numberControl.enable();
    numberControl.updateValueAndValidity();
  }

  protected onIdTypeClear() {
    const numberControl = this.formHelper.getFormGroupControl('idDocument', 'number');
    numberControl.setValue(undefined);
    numberControl.disable();
  }
}
