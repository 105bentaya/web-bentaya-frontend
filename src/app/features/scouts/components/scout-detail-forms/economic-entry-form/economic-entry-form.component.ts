import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {finalize, map} from "rxjs";
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {EconomicEntry, EntryType, ScoutDonor} from "../../../models/scout.model";
import {EconomicEntryForm} from "../../../models/scout-form.model";
import {ScoutService} from "../../../services/scout.service";
import {InvoiceConceptType, InvoiceTypes} from "../../../../invoice/invoice.model";
import {Select} from "primeng/select";
import {GroupService} from "../../../../../shared/services/group.service";
import {accounts, personTypes} from "../../../../../shared/constant";
import {EconomicConceptPipe} from "../../../../invoice/economic-concept.pipe";
import {EntryTypePipe} from "../../../pipes/entry-type.pipe";
import ScoutHelper from "../../../scout.util";
import {SelectButton} from "primeng/selectbutton";
import {IdDocumentFormComponent} from "../../id-document-form/id-document-form.component";

@Component({
  selector: 'app-economic-entry-form',
  imports: [
    DatePicker,
    FloatLabel,
    FormTextAreaComponent,
    FormsModule,
    InputNumber,
    InputText,
    ReactiveFormsModule,
    SaveButtonsComponent,
    Select,
    PrimeTemplate,
    EntryTypePipe,
    SelectButton,
    IdDocumentFormComponent
  ],
  templateUrl: './economic-entry-form.component.html',
  styleUrl: './economic-entry-form.component.scss',
  providers: [EconomicConceptPipe]
})
export class EconomicEntryFormComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly scoutService = inject(ScoutService);
  private readonly groupService = inject(GroupService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly alertService = inject(AlertService);
  private readonly conceptPipe = inject(EconomicConceptPipe);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly formHelper = new FormHelper();

  protected readonly personTypes = personTypes;
  protected readonly types: EntryType[] = [
    "DONATION",
    "PAYMENT",
    "CONTRIBUTION",
    "CHARGE"
  ];
  protected accounts = [
    ...accounts,
    "Caja Tesorería"
  ];

  protected donor!: ScoutDonor;
  protected entryId: number | undefined;
  private scoutId!: number;
  protected loading = false;
  protected deleteLoading = false;
  protected donationTypes!: InvoiceTypes;
  protected hasDonated = false;

  ngOnInit() {
    this.groupService.getBasicGroups().subscribe(res => this.accounts = this.accounts.concat(res.map(group => `Caja ${group.name}`)));
    const entry = this.config.data.entry;
    this.scoutId = this.config.data.scoutId;
    this.scoutService.getScoutDonor(this.scoutId).subscribe(res => this.donor = res);
    this.entryId = entry?.id;
    this.createForm(entry);
    this.getDonationTypes();
  }

  private getDonationTypes() {
    this.scoutService.getDonationTypes
      .pipe(map(concepts => ({
        expenseTypes: this.transformConceptType(concepts.expenseTypes),
        incomeTypes: this.transformConceptType(concepts.incomeTypes)
      })))
      .subscribe(result => {
        this.donationTypes = result;
        this.checkForType();
      });
  }

  private checkForType() {
    if (this.formHelper.controlValue("incomeId")) {
      this.formHelper.get("incomeId")?.enable();
      this.onIncomeSelect();
    } else if (this.formHelper.controlValue("expenseId")) {
      this.formHelper.get("expenseId")?.enable();
      this.formHelper.get("type")?.enable();
      this.onExpenseSelect();
    } else {
      this.formHelper.get("incomeId")?.enable();
      this.formHelper.get("expenseId")?.enable();
      this.formHelper.get("type")?.enable();
    }
  }

  private transformConceptType(types: InvoiceConceptType[]) {
    return types.map(concept => ({...concept, description: this.conceptPipe.transform(concept)}));
  }

  private createForm(data?: EconomicEntry) {
    if (data?.type === "DONATION" && data.donor) {
      this.hasDonated = true;
    }

    this.formHelper.createForm({
      issueDate: [DateUtils.dateOrUndefined(data?.issueDate), Validators.required],
      dueDate: [DateUtils.dateOrUndefined(data?.dueDate), Validators.required],
      description: [data?.description, [Validators.required, Validators.maxLength(255)]],
      amount: [data?.amount ? data?.amount / 100 : null, Validators.required],
      incomeId: [data?.incomeType?.id],
      expenseId: [data?.expenseType?.id],
      account: [data?.account, [Validators.maxLength(255), Validators.required]],
      type: [data?.type, [Validators.required, Validators.maxLength(255)]],
      observations: [data?.observations, Validators.maxLength(511)],
      donor: this.formBuilder.group({
        name: [data?.donor?.name, this.requiredIfDonation],
        surname: [data?.donor?.surname, this.requiredIfDonationReal],
        idDocument: ScoutHelper.idDocumentFormGroup(this.formBuilder, data?.donor?.idDocument),
        personType: [data?.donor?.personType, this.requiredIfDonation,]
      })
    }, {validators: [this.expenseIncomeValidator]});
    this.formHelper.getFormGroup("donor").get("idDocument")?.get("idType")?.setValidators(this.requiredIfDonation);

    this.formHelper.get("incomeId")?.disable();
    this.formHelper.get("expenseId")?.disable();
    this.formHelper.get("type")?.disable();
  }

  private readonly requiredIfDonation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.typeIsDonation && !control.value ? {required: true} : null;
  };

  private readonly requiredIfDonationReal: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.typeIsDonation && this.donorIsReal && !control.value ? {required: true} : null;
  };

  private readonly expenseIncomeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !control.get("incomeId")?.value && !control.get("expenseId")?.value ? {expenseIncomeRequired: true} : null;
  };

  protected get typeIsDonation() {
    return this.formHelper.controlValue("type") === 'DONATION';
  }

  protected get donorIsReal() {
    return this.formHelper.getFormGroup("donor").get("personType")?.value === 'REAL';
  }

  protected onTypeChange() {
    if (this.typeIsDonation && !this.hasDonated) {
      const donor = this.formHelper.getFormGroup("donor");
      donor.get("name")?.setValue(this.donor.name);
      donor.get("surname")?.setValue(this.donor.surname);
      donor.get("personType")?.setValue(this.donor.personType);
      donor.get("idDocument")?.get("idType")?.setValue(this.donor.idDocument?.idType);
      donor.get("idDocument")?.get("number")?.setValue(this.donor.idDocument?.number);
    }
  }

  protected onIncomeSelect() {
    const value = this.formHelper.get("incomeId")?.value;
    const control = this.formHelper.get("expenseId");
    const typeControl = this.formHelper.get("type");

    if (value) {
      if (this.donationTypes.incomeTypes.find(income => income.id === value)?.donation) {
        typeControl?.setValue('DONATION');
        typeControl?.disable();
        this.onTypeChange();
      } else {
        typeControl?.enable();
      }
      control?.setValue(null);
      control?.disable();
    } else {
      typeControl?.enable();
      control?.enable();
    }
  }

  protected onExpenseSelect() {
    const value = this.formHelper.get("expenseId")?.value;
    const control = this.formHelper.get("incomeId");
    this.formHelper.get("expenseId")?.enable();

    if (value) {
      control?.setValue(null);
      control?.disable();
    } else {
      control?.enable();
    }
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;

      const form: EconomicEntryForm = {...this.formHelper.value};
      form.type = this.formHelper.controlValue("type");
      form.issueDate = DateUtils.toLocalDate(form.issueDate);
      form.dueDate = DateUtils.toLocalDate(form.dueDate);
      form.amount *= 100;

      if (form.type != "DONATION") {
        form.donor = undefined;
      }

      const saveDonation = this.entryId ?
        this.scoutService.updateEntry(this.scoutId, this.entryId, form) :
        this.scoutService.addEntry(this.scoutId, form);

      saveDonation.pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.alertService.sendBasicSuccessMessage("Donación guardada");
          this.ref.close(result);
        });
    }
  }

  protected cancelOrDelete() {
    if (this.entryId) {
      this.askForDeleteRecord();
    } else {
      this.ref.close();
    }
  }

  private askForDeleteRecord() {
    this.confirmationService.confirm({
      message: "¿Desea eliminar esta donación? Esta acción no se puede revertir.",
      header: "Eliminar Donación",
      accept: () => this.deleteRecord()
    });
  }

  private deleteRecord() {
    this.deleteLoading = true;
    this.scoutService.deleteEntry(this.scoutId, this.entryId!)
      .pipe(finalize(() => this.deleteLoading = false))
      .subscribe(() => {
        this.alertService.sendBasicSuccessMessage("Donación eliminada con éxito");
        this.ref.close(-1);
      });
  }
}
