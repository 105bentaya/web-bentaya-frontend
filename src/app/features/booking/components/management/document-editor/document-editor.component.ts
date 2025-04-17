import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  BookingDocument,
  BookingDocumentForm,
  DocumentDuration,
  DocumentStatus
} from "../../../model/booking-document.model";
import {SelectButton} from "primeng/selectbutton";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {DatePicker} from "primeng/datepicker";
import {Button} from "primeng/button";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {NgClass} from "@angular/common";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {BookingService} from "../../../service/booking.service";
import {FileUtils} from "../../../../../shared/util/file.utils";
import {finalize} from "rxjs";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-document-editor',
  imports: [
    SelectButton,
    FormsModule,
    ReactiveFormsModule,
    DatePicker,
    Button,
    SaveButtonsComponent,
    NgClass
  ],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly config = inject(DynamicDialogConfig);
  protected readonly ref = inject(DynamicDialogRef);
  protected readonly helper = new FormHelper();

  protected readonly statuses: { value: DocumentStatus, label: string }[] = [
    {value: "ACCEPTED", label: "Válido"},
    {value: "PENDING", label: "Pendiente"},
    {value: "REJECTED", label: "Inválido"},
  ];
  protected readonly durations: { value: DocumentDuration, label: string }[] = [
    {value: "PERMANENT", label: "Perenne"},
    {value: "EXPIRABLE", label: "Periódico"},
    {value: "SINGLE_USE", label: "Actividad"},
  ];
  protected readonly document!: BookingDocument;

  protected loading: boolean = false;
  protected downloading: boolean = false;
  protected deleteLoading: boolean = false;

  constructor() {
    this.document = this.config.data.document;
    if (!this.document) this.ref.close();
  }

  ngOnInit() {
    this.helper.createForm({
      status: [this.document.status, Validators.required],
      duration: [this.document.duration, this.durationValidator],
      expirationDate: [this.document.expirationDate ? DateUtils.shiftDateToUTC(this.document.expirationDate) : null, this.expirationDateValidator]
    });
  }

  private readonly durationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!control.value && this.acceptedSelected) ? {required: true} : null;
  };

  private readonly expirationDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!control.value && this.acceptedSelected && this.durationExpirable) ? {required: true} : null;
  };

  get acceptedSelected() {
    return this.helper.controlValue("status") === "ACCEPTED";
  }

  get durationExpirable() {
    return this.helper.controlValue("duration") === "EXPIRABLE";
  }

  protected submitForm() {
    if (this.helper.validateAll()) {
      const documentForm: BookingDocumentForm = {...this.helper.form.value};
      if (documentForm.status !== "ACCEPTED") documentForm.duration = undefined;
      documentForm.expirationDate = documentForm.duration === "EXPIRABLE" ?
        DateUtils.toLocalDate(documentForm.expirationDate!) :
        undefined;

      this.loading = true;
      this.bookingService.updateDocument(this.document.id, documentForm).subscribe({
        next: res => this.ref.close(res),
        error: () => this.loading = false
      });
    }
  }

  protected openDocument() {
    FileUtils.openFile(this.bookingService.getPDF(this.document.id));
  }

  protected downloadDocument() {
    this.downloading = true;
    this.bookingService.getPDF(this.document.id)
      .pipe(finalize(() => this.downloading = false))
      .subscribe(res => FileUtils.downloadFile(res));
  }

  protected deleteDocument() {
    this.confirmationService.confirm({
      message: "¿Desea eliminar este documento? Esta acción no se podrá deshacer",
      accept: () => {
        this.deleteLoading = true;
        this.bookingService.deleteDocument(this.document.id).subscribe({
          next: () => this.ref.close("deleted"),
          error: () => this.deleteLoading = false
        });
      }
    });
  }
}
