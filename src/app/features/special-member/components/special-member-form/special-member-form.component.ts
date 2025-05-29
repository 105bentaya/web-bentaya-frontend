import {Component, inject, input, model, OnInit, output} from '@angular/core';
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Select} from "primeng/select";
import {
  FilterResult,
  SpecialMember,
  specialMemberOptions,
  SpecialMemberPerson,
  SpecialMemberRole
} from "../../models/special-member.model";
import {FloatLabel} from "primeng/floatlabel";
import {SpecialMemberService} from "../../special-member.service";
import {InputNumber} from "primeng/inputnumber";
import {DatePicker} from "primeng/datepicker";
import {InputText} from "primeng/inputtext";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {RadioButton} from "primeng/radiobutton";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {
  RadioButtonContainerComponent
} from "../../../../shared/components/radio-button-container/radio-button-container.component";
import {AutoComplete} from "primeng/autocomplete";
import {Tooltip} from "primeng/tooltip";
import {SelectButton} from "primeng/selectbutton";
import {idTypes, personTypes, yesNoOptions} from "../../../../shared/constant";
import ScoutHelper from "../../../scouts/scout.util";
import {DateUtils} from "../../../../shared/util/date-utils";
import {SpecialMemberForm} from "../../models/special-member-form.model";
import {ConfirmationService} from "primeng/api";
import {CensusPipe} from "../../../scouts/census.pipe";

type RelationType = 'SCOUT' | 'EXISTING' | 'NEW' | 'NONE';

@Component({
  selector: 'app-special-member-form',
  imports: [
    Select,
    ReactiveFormsModule,
    FloatLabel,
    InputNumber,
    DatePicker,
    InputText,
    FormTextAreaComponent,
    RadioButton,
    FormsModule,
    SaveButtonsComponent,
    RadioButtonContainerComponent,
    AutoComplete,
    Tooltip,
    SelectButton
  ],
  templateUrl: './special-member-form.component.html',
  styleUrl: './special-member-form.component.scss',
  providers: [CensusPipe]
})
export class SpecialMemberFormComponent implements OnInit {

  protected readonly formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);
  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly censusPipe = inject(CensusPipe);

  protected readonly specialMemberOptions = specialMemberOptions;
  protected readonly personTypes = personTypes;
  protected readonly yesNoOptions = yesNoOptions;
  protected readonly idTypes = idTypes;

  public loading = model.required<boolean>();
  public existingForm = input<SpecialMember>();
  public onSave = output<SpecialMemberForm>();
  public onCancel = output<void>();

  private nextCensus: number | undefined;
  private selectedRole: SpecialMemberRole | undefined;

  protected scoutItems: FilterResult[] = [];
  protected specialMemberItems: FilterResult[] = [];

  ngOnInit() {
    const existingForm = this.existingForm();
    let existingPerson: SpecialMemberPerson | undefined;

    let relation: RelationType | undefined;
    if (existingForm?.person.scoutId) {
      relation = "NONE";
    } else if (existingForm?.person.personId) {
      relation = "NEW";
      existingPerson = existingForm?.person;
    }

    this.formHelper.createForm({
      role: [existingForm?.role, Validators.required],
      roleCensus: [existingForm?.roleCensus, Validators.required],
      agreementDate: [DateUtils.dateOrUndefined(existingForm?.agreementDate)],
      awardDate: [DateUtils.dateOrUndefined(existingForm?.awardDate)],
      details: [existingForm?.details, Validators.maxLength(255)],
      observations: [existingForm?.observations, Validators.maxLength(65535)],
      relation: [relation, Validators.required],
      scoutId: [null, this.requiredRelation('SCOUT')],
      personId: [null, this.requiredRelation('EXISTING')],
      person: this.formBuilder.group({
        type: [existingPerson?.type, this.requiredRelation('NEW')],
        name: [
          existingPerson?.type === 'REAL' ? existingPerson?.name : existingPerson?.companyName,
          [this.requiredRelation('NEW'), Validators.maxLength(255)]
        ],
        surname: [existingPerson?.surname, Validators.maxLength(255)],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, existingPerson?.idDocument),
        phone: [existingPerson?.phone, Validators.maxLength(255)],
        email: [existingPerson?.email, [Validators.maxLength(255), Validators.email]]
      })
    });
    this.idDocumentType.setValidators(this.requiredRelation('NEW'));
    if (!this.idDocumentType.value) {
      this.idDocumentNumber.disable();
    }
    if (existingForm) {
      this.formHelper.get("role")?.disable();
      this.selectedRole = existingForm.role;
      this.specialMemberService.findLastCensus(existingForm.role).subscribe(census => {
        this.nextCensus = census + 1;
      });
    }
  }

  protected requiredRelation(relation: RelationType): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.formHelper.controlValue("relation") === relation && !control.value ? {required: true} : null;
    };
  };

  protected onRoleSelect(value: SpecialMemberRole) {
    this.specialMemberService.findLastCensus(value).subscribe(census => {
      this.nextCensus = census + 1;
      this.formHelper.get("roleCensus")?.setValue(this.nextCensus);
      this.selectedRole = value;
    });
  }

  protected getPrefix(): string {
    let result = this.censusPipe.transform(1, this.selectedRole)[0];
    const currentCensusLength = 4 - this.formHelper.controlValue("roleCensus")?.toString().length;
    if (currentCensusLength > 0) {
      result += "0".repeat(currentCensusLength);
    }
    return result;
  }

  protected getDetailLabel() {
    return this.selectedRole === "FOUNDER" ? "Familia" : "Lugar";
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading.set(true);
      const form = {...this.formHelper.value};
      form.role = this.selectedRole;
      form.awardDate = form.awardDate ? DateUtils.toLocalDate(form.awardDate) : undefined;
      form.agreementDate = form.agreementDate ? DateUtils.toLocalDate(form.agreementDate) : undefined;
      if (form.relation !== "SCOUT") {
        form.scoutId = undefined;
      } else {
        form.scoutId = form.scoutId.id;
      }
      if (form.relation !== "EXISTING") {
        form.personId = undefined;
      } else {
        form.personId = form.personId.id;
      }
      if (form.relation !== "NEW") {
        form.person = undefined;
      } else if (form.person.type === "JURIDICAL") {
        form.person.companyName = form.person.name;
        form.person.name = undefined;
        form.person.surname = undefined;
      }
      delete form.relation;

      this.checkForCensusChange(form);
    }
  }

  private checkForCensusChange(form: SpecialMemberForm) {
    if (form.roleCensus > this.nextCensus!) {
      this.confirmationService.confirm({
        header: 'Aviso',
        message: `El último número censo se actualizará al número ${form.roleCensus},
        cuando el último de la lista es el ${this.nextCensus! - 1}.
        Si desea volver a cambiarlo tendrá que entrar a la pestaña de ajustes. ¿Desea continuar?`,
        accept: () => this.onSave.emit(form),
        reject: () => this.loading.set(false)
      });
    } else {
      this.onSave.emit(form);
    }
  }

  protected onScoutSearch(event: any) {
    this.specialMemberService.searchScout(event.query).subscribe(res => this.scoutItems = res);
  }

  protected onSpecialMemberSearch(event: any) {
    this.specialMemberService.searchSpecialMember(event.query).subscribe(res => this.specialMemberItems = res);
  }

  get relation(): RelationType {
    return this.formHelper.controlValue("relation");
  }

  get idDocumentType(): FormControl {
    return this.formHelper.get(['person', 'idDocument', 'idType']) as FormControl;
  }

  get idDocumentNumber(): FormControl {
    return this.formHelper.get(['person', 'idDocument', 'number']) as FormControl;
  }

  protected onIdTypeChange() {
    this.idDocumentNumber.enable();
    this.idDocumentNumber.updateValueAndValidity();
  }

  protected onIdTypeClear() {
    this.idDocumentNumber.setValue(undefined);
    this.idDocumentNumber.disable();
  }
}
