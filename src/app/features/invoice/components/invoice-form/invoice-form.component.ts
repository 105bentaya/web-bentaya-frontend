import {Component, inject, OnInit, viewChild} from '@angular/core';
import {SelectModule} from "primeng/select";
import {FloatLabelModule} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {SelectButtonModule} from "primeng/selectbutton";
import {TabViewModule} from "primeng/tabview";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Invoice, InvoiceExpenseType, InvoiceGrant, InvoicePayer} from "../../invoice.model";
import {FormHelper} from "../../../../shared/util/form-helper";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {CheckboxModule} from "primeng/checkbox";
import {InvoiceService} from "../../invoice.service";
import {SplitButtonModule} from "primeng/splitbutton";
import {ConfirmationService, MenuItem} from "primeng/api";
import {DatePicker} from "primeng/datepicker";
import {DateUtils} from "../../../../shared/util/date-utils";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {finalize, forkJoin} from "rxjs";
import {FileUpload} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {imageAndPdfTypes} from "../../../../shared/util/file.utils";

@Component({
  selector: 'app-invoice-form',
  imports: [
    SelectModule,
    FloatLabelModule,
    FormTextAreaComponent,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectButtonModule,
    TabViewModule,
    CheckboxModule,
    SplitButtonModule,
    DatePicker,
    CheckboxContainerComponent,
    SaveButtonsComponent,
    FileUpload
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent implements OnInit {

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly alertService = inject(AlertService);
  private readonly invoiceService = inject(InvoiceService);
  readonly confirmationService = inject(ConfirmationService);

  protected readonly invoiceFormHelper = new FormHelper();
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly imageAndPdfTypes = imageAndPdfTypes;

  private readonly saveButton: MenuItem = {label: "Guardar y cerrar", command: () => this.onSubmit()};
  private readonly saveButtonAndContinue: MenuItem = {label: "Guardar y seguir", command: () => this.onSubmit(true)};

  protected expenseTypes!: InvoiceExpenseType[];
  protected grants!: InvoiceGrant[];
  protected payers!: InvoicePayer[];

  protected invoiceToUpdate: Invoice | undefined;
  private dateHasBeenSelected = false;

  protected buttons: MenuItem[] | undefined;
  protected saveAndContinue: boolean = false;

  protected saveLoading: boolean = false;
  protected deleteLoading: boolean = false;
  protected documentsLoading = false;

  private readonly uploader = viewChild.required(FileUpload);

  ngOnInit(): void {
    if (this.config.data) {
      this.expenseTypes = this.config.data.invoiceData.expenseTypes.map((expense: InvoiceExpenseType) => this.transformExpenseName(expense));
      this.grants = this.config.data.invoiceData.grants;
      this.payers = this.config.data.invoiceData.payers;
      if (this.config.data.invoice) {
        this.dateHasBeenSelected = true;
        this.invoiceToUpdate = this.config.data.invoice;
        this.initForm(this.invoiceToUpdate);
      } else {
        this.initForm();
      }
      if (this.config.data.allowMultipleAdding) {
        this.buttons = [this.saveButtonAndContinue];
      }
    } else {
      this.alertService.sendBasicErrorMessage("No se han cargado los datos necesarios para rellenar el formulario");
      this.ref.close();
    }
  }

  private transformExpenseName(expense: InvoiceExpenseType): InvoiceExpenseType {
    expense.expenseType = `${expense.id} - ${expense.expenseType}`;
    return expense;
  }

  private initForm(invoice?: Invoice) {
    this.invoiceFormHelper.createForm({
      invoiceDate: [invoice ? new Date(invoice.invoiceDate) : null, Validators.required],
      issuer: [invoice?.issuer, [Validators.required, Validators.maxLength(255)]],
      invoiceNumber: [invoice?.invoiceNumber, [Validators.required, Validators.maxLength(255)]],
      nif: [invoice?.nif, [Validators.required, Validators.maxLength(255)]],
      amount: [invoice?.amount ? invoice.amount / 100 : null, Validators.required],
      receipt: [invoice?.receipt || false, Validators.required],
      complies: [invoice?.complies || false, Validators.required],
      paymentDate: [invoice ? new Date(invoice.paymentDate) : null, Validators.required],
      method: [invoice?.method, [Validators.required, Validators.maxLength(255)]],
      liquidated: [invoice?.liquidated || false, Validators.required],
      observations: [invoice?.observations, Validators.maxLength(4095)],
      expenseType: [this.findExpenseType(invoice), Validators.required],
      payer: [invoice?.payer, Validators.required],
      grant: [invoice?.grant]
    });
  }

  private findExpenseType(invoice?: Invoice) {
    return this.expenseTypes.find((expense) => expense.id === invoice?.expenseType.id);
  }

  protected onSubmit(continueAdding = false) {
    this.invoiceFormHelper.validateAll();
    if (this.invoiceFormHelper.valid) {
      const invoice: Invoice = {...this.invoiceFormHelper.value};
      invoice.amount *= 100;
      invoice.invoiceDate = DateUtils.toLocalDate(invoice.invoiceDate);
      invoice.paymentDate = DateUtils.toLocalDate(invoice.paymentDate);
      this.saveLoading = true;
      this.saveOrUpdate(invoice)
        .pipe(finalize(() => this.saveLoading = false))
        .subscribe(invoice => {
          const finalAction = () => continueAdding ? this.resetForm(invoice) : this.ref.close("saved");
          this.alertService.sendBasicSuccessMessage("Éxito al guardar la factura");
          if (this.uploader().files?.length > 0) {
            this.uploadFiles(invoice.id, finalAction);
          } else {
            finalAction();
          }
        });
    }
  }

  protected uploadFiles(invoiceId: number, action: () => void) {
    const fileUploadPetitions = this.uploader().files.map(file => this.invoiceService.uploadFile(invoiceId, file));
    this.documentsLoading = true;
    forkJoin(fileUploadPetitions)
      .pipe(finalize(() => {
        this.uploader().clear();
        this.documentsLoading = false;
        action();
      }))
      .subscribe({
        complete: () => this.alertService.sendBasicSuccessMessage("Documentos subidos correctamente")
      });
  }

  private resetForm(invoice: Invoice) {
    this.config.header = "Añadir Factura";
    this.saveAndContinue = true;
    this.dateHasBeenSelected = false;
    this.buttons = [this.saveButton];
    this.invoiceToUpdate = undefined;
    this.initForm();
    this.invoiceFormHelper.get("payer")?.setValue(invoice.payer);
  }

  private saveOrUpdate(invoice: Invoice) {
    if (this.invoiceToUpdate) {
      invoice.id = this.invoiceToUpdate.id;
      return this.invoiceService.update(invoice);
    }
    return this.invoiceService.save(invoice);
  }

  protected onDateSelect(event: Date) {
    if (!this.dateHasBeenSelected) {
      this.dateHasBeenSelected = true;
      this.invoiceFormHelper.get("paymentDate")?.setValue(event);
      this.invoiceFormHelper.get("invoiceDate")?.setValue(event);
    }
  }

  protected askForDeletion() {
    this.confirmationService.confirm({
      message: '¿Desea borrar esta factura? Esta acción no se podrá revertir.',
      accept: () => this.deleteInvoice()
    });
  }

  private deleteInvoice() {
    this.deleteLoading = true;
    this.invoiceService.delete(this.invoiceToUpdate!.id).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Factura borrada con éxito");
        this.ref.close("deleted");
      }
    });
  }
}
