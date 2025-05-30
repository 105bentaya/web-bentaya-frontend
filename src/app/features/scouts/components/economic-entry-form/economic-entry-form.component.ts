import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {FormHelper} from "../../../../shared/util/form-helper";
import {DateUtils} from "../../../../shared/util/date-utils";
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize} from "rxjs";
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {EconomicEntry} from "../../models/member.model";
import {EconomicEntryForm} from "../../models/member-form.model";
import {ScoutService} from "../../services/scout.service";

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
    SaveButtonsComponent
  ],
  templateUrl: './economic-entry-form.component.html',
  styleUrl: './economic-entry-form.component.scss'
})
export class EconomicEntryFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly scoutService = inject(ScoutService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly alertService = inject(AlertService);
  protected readonly formHelper = new FormHelper();

  protected entryId: number | undefined;
  private scoutId!: number;
  protected loading = false;
  protected deleteLoading = false;

  ngOnInit() {
    const entry = this.config.data.entry;
    this.scoutId = this.config.data.scoutId;
    this.entryId = entry?.id;
    this.createForm(entry);
  }

  private createForm(data?: EconomicEntry) {
    this.formHelper.createForm({
      date: [DateUtils.dateOrUndefined(data?.date), Validators.required],
      description: [data?.description, [Validators.required, Validators.maxLength(255)]],
      amount: [data?.amount ? data?.amount / 100 : null, Validators.required],
      income: [data?.income, Validators.maxLength(255)],
      spending: [data?.spending, Validators.maxLength(255)],
      account: [data?.account, Validators.maxLength(255)],
      type: [data?.type, [Validators.required, Validators.maxLength(255)]],
      observations: [data?.observations, Validators.maxLength(511)]
    });

    if (data?.income) {
      this.onIncomeSelect();
    } else if (data?.spending) {
      this.onSpendingSelect();
    }
  }

  protected onIncomeSelect() {
    const value = this.formHelper.get("income")?.value;
    const control = this.formHelper.get("spending");

    if (value) {
      control?.setValue(null);
      control?.disable();
    } else {
      control?.enable();
    }
  }

  protected onSpendingSelect() {
    const value = this.formHelper.get("spending")?.value;
    const control = this.formHelper.get("income");

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
      form.date = DateUtils.toLocalDate(form.date);
      form.amount *= 100;

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
