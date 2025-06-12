import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {DateUtils} from "../../../../shared/util/date-utils";
import {finalize} from "rxjs";
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Select} from "primeng/select";
import {DonationType, SpecialMemberDonation} from "../../models/special-member.model";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {SpecialMemberService} from "../../special-member.service";
import {SpecialMemberDonationForm} from "../../models/special-member-form.model";
import {accounts} from "../../../../shared/constant";

@Component({
  selector: 'app-special-member-donation-form',
  imports: [
    DatePicker,
    FloatLabel,
    FormTextAreaComponent,
    FormsModule,
    ReactiveFormsModule,
    SaveButtonsComponent,
    Select,
    InputNumber,
    InputText
  ],
  templateUrl: './special-member-donation-form.component.html',
  styleUrl: './special-member-donation-form.component.scss'
})
export class SpecialMemberDonationFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly alertService = inject(AlertService);
  protected readonly formHelper = new FormHelper();

  protected readonly types: { value: DonationType, label: string }[] = [
    {value: 'ECONOMIC', label: 'Económica'},
    {value: 'IN_KIND', label: 'En especies'}
  ];
  protected readonly accounts = accounts;
  protected readonly paymentTypes = ["Transferencia", "Adeudo en Cuenta"];

  protected donationId: number | undefined;
  private memberId!: number;
  protected loading = false;
  protected deleteLoading = false;

  ngOnInit() {
    const donation = this.config.data.donation;
    this.memberId = this.config.data.memberId;
    this.donationId = donation?.id;
    this.createForm(donation);
  }

  get donationType(): DonationType {
    return this.formHelper.controlValue("type");
  }

  private createForm(data?: SpecialMemberDonation) {
    return this.formHelper.createForm({
      id: [data?.id],
      date: [DateUtils.dateOrUndefined(data?.date), Validators.required],
      type: [data?.type, Validators.required],
      inKindDonationType: [data?.inKindDonationType, [this.requiredIfType('IN_KIND'), Validators.maxLength(255)]],
      amount: [data?.amount ? data?.amount / 100 : null, [Validators.required, Validators.min(0)]],
      paymentType: [data?.paymentType, [this.requiredIfType('ECONOMIC'), Validators.maxLength(255)]],
      bankAccount: [data?.bankAccount, [this.requiredIfType('ECONOMIC'), Validators.maxLength(255)]],
      notes: [data?.notes, Validators.maxLength(511)]
    });
  }

  protected requiredIfType(type: DonationType): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.formHelper.controlValue("type") === type && !control.value ? {required: true} : null;
    };
  };

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;

      const form: SpecialMemberDonationForm = {...this.formHelper.value};
      form.date = DateUtils.toLocalDate(form.date);
      form.amount! *= 100;

      if (form.type === 'ECONOMIC') {
        delete form.inKindDonationType;
      } else {
        delete form.paymentType;
        delete form.bankAccount;
      }

      const saveDonation = this.donationId ?
        this.specialMemberService.updateDonation(this.memberId, this.donationId, form) :
        this.specialMemberService.addDonation(this.memberId, form);

      saveDonation.pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.alertService.sendBasicSuccessMessage("Donación guardada");
          this.ref.close(result);
        });
    }
  }

  protected cancelOrDelete() {
    if (this.donationId) {
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
    this.specialMemberService.deleteDonation(this.memberId, this.donationId!)
      .pipe(finalize(() => this.deleteLoading = false))
      .subscribe(() => {
        this.alertService.sendBasicSuccessMessage("Donación eliminada con éxito");
        this.ref.close(-1);
      });
  }
}
