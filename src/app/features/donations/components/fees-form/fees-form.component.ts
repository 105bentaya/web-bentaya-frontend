import {Component, inject, OnInit} from '@angular/core';
import {Select} from "primeng/select";
import {FloatLabel} from "primeng/floatlabel";
import {DatePicker} from "primeng/datepicker";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {FormHelper} from "../../../../shared/util/form-helper";
import {accounts, maxFileUploadByteSize} from "../../../../shared/constant";
import {InvoiceConceptType} from "../../../invoice/invoice.model";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {ScoutService} from "../../../scouts/services/scout.service";
import {finalize, map} from "rxjs";
import {DateUtils} from "../../../../shared/util/date-utils";
import {FeeForm} from "../../model/donation-form.model";
import {
  RadioButtonContainerComponent
} from "../../../../shared/components/radio-button-container/radio-button-container.component";
import {RadioButton} from "primeng/radiobutton";
import {NgClass} from "@angular/common";
import {Tag} from "primeng/tag";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {FileUtils} from "../../../../shared/util/file.utils";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-fees-form',
  imports: [
    Select,
    FloatLabel,
    DatePicker,
    FormsModule,
    InputNumber,
    InputText,
    ReactiveFormsModule,
    SaveButtonsComponent,
    RadioButtonContainerComponent,
    RadioButton,
    NgClass,
    Tag,
    FileUpload
  ],
  templateUrl: './fees-form.component.html',
  styleUrl: './fees-form.component.scss'
})
export class FeesFormComponent implements OnInit {
  private readonly scoutService = inject(ScoutService);
  private readonly ref = inject(DynamicDialogRef);

  protected readonly formHelper = new FormHelper();

  protected readonly accounts = accounts;
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected allowedFiles = FileUtils.getAllowedExtensions("EXCEL");

  protected loading = false;

  protected donationTypes!: InvoiceConceptType[];

  ngOnInit() {
    this.formHelper.createForm({
      issueDate: [null, Validators.required],
      dueDate: [null, Validators.required],
      description: [null, [Validators.required, Validators.maxLength(255)]],
      amount: [null, this.requiredWhenCurrentScouts],
      donationTypeId: [null, Validators.required],
      account: [null, [Validators.maxLength(255), Validators.required]],
      applyToCurrentScouts: [null, Validators.required],
      file: [null, this.requiredWhenNotCurrentScouts]
    });

    this.scoutService.getDonationTypes.pipe(
      map(type => [...type.incomeTypes, ...type.expenseTypes].filter(type => type.donation))
    ).subscribe(res => this.donationTypes = res);

  }

  private readonly requiredWhenCurrentScouts: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.formHelper.controlValue("applyToCurrentScouts") === true && !control.value ? {required: true} : null;
  };

  private readonly requiredWhenNotCurrentScouts: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.formHelper.controlValue("applyToCurrentScouts") === false && !control.value ? {required: true} : null;
  };

  protected onSubmit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const value: FeeForm = {...this.formHelper.value};
      value.issueDate = DateUtils.toLocalDate(value.issueDate);
      value.dueDate = DateUtils.toLocalDate(value.dueDate);

      if (value.applyToCurrentScouts) {
        value.amount! *= 100;
        delete value.file;
      } else {
        delete value.amount;
      }

      this.fileControl.setValue(undefined);

      this.scoutService.addFees(value)
        .pipe(finalize(() => this.loading = false))
        .subscribe(() => this.ref.close());
    }
  }

  protected openUploader(uploader: FileUpload) {
    if (this.loading) return;
    uploader.el.nativeElement.getElementsByClassName("p-fileupload-choose-button")[0].click();
  }

  get formHasFile() {
    return this.fileControl.value;
  }

  protected deleteFile() {
    this.fileControl.setValue(undefined);
  }

  protected onUpload(event: FileUploadHandlerEvent) {
    if (event.files?.length === 1) {
      this.fileControl.setValue(event.files[0]);
    }
  }

  get fileControl() {
    return this.formHelper.get("file");
  }
}
