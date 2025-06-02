import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {ScoutRecord} from "../../../models/scout.model";
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {FloatLabel} from "primeng/floatlabel";
import {DatePicker} from "primeng/datepicker";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {ScoutService} from "../../../services/scout.service";
import {finalize} from "rxjs";
import {ConfirmationService} from "primeng/api";
import {AlertService} from "../../../../../shared/services/alert-service.service";

@Component({
  selector: 'app-record-form',
  imports: [
    ReactiveFormsModule,
    Select,
    FloatLabel,
    DatePicker,
    FormTextAreaComponent,
    SaveButtonsComponent
  ],
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.scss'
})
export class RecordFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly scoutService = inject(ScoutService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly alertService = inject(AlertService);
  protected readonly formHelper = new FormHelper();

  protected readonly types = [
    "Informativo", "Disciplinario"
  ];

  protected recordId: number | undefined;
  private scoutId!: number;
  protected loading = false;
  protected deleteLoading = false;

  ngOnInit() {
    const record = this.config.data.record;
    this.scoutId = this.config.data.scoutId;
    this.recordId = record?.id;
    this.createRecord(record);
  }

  private createRecord(data?: ScoutRecord) {
    return this.formHelper.createForm({
      id: [data?.id],
      recordType: [data?.recordType, Validators.required],
      startDate: [DateUtils.dateOrUndefined(data?.startDate), Validators.required],
      endDate: [DateUtils.dateOrUndefined(data?.endDate)],
      observations: [data?.observations, [Validators.required, Validators.maxLength(65535)]]
    });
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;

      const form = {...this.formHelper.value};
      form.startDate = DateUtils.toLocalDate(form.startDate);
      form.endDate = form.endDate ? DateUtils.toLocalDate(form.endDate) : undefined;

      const sub = this.recordId ?
        this.scoutService.updateScoutRecord(this.scoutId, this.recordId, form) :
        this.scoutService.addScoutRecord(this.scoutId, form);
      sub.pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.alertService.sendBasicSuccessMessage("Expediente guardado");
          this.ref.close(result);
        });
    }
  }

  protected cancelOrDelete() {
    if (this.recordId) {
      this.askForDeleteRecord();
    } else {
      this.ref.close();
    }
  }

  private askForDeleteRecord() {
    this.confirmationService.confirm({
      message: "¿Desea eliminar este expediente? Esta acción no se puede revertir.",
      header: "Eliminar expediente",
      accept: () => this.deleteRecord()
    });
  }

  private deleteRecord() {
    this.deleteLoading = true;
    this.scoutService.deleteScoutRecord(this.scoutId, this.recordId!)
      .pipe(finalize(() => this.deleteLoading = false))
      .subscribe(() => {
        this.alertService.sendBasicSuccessMessage("Expediente eliminado con éxito");
        this.ref.close(-1);
      });
  }
}
