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
import {Invoice, InvoiceConceptType, InvoiceGrant, InvoicePayer, IssuerNif} from "../../invoice.model";
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
import {FileUtils} from "../../../../shared/util/file.utils";
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from "primeng/autocomplete";
import {KeyFilter} from "primeng/keyfilter";
import {EconomicConceptPipe} from "../../economic-concept.pipe";

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
    FileUpload,
    AutoComplete,
    KeyFilter
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
  providers: [EconomicConceptPipe]
})
export class InvoiceFormComponent implements OnInit {

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly alertService = inject(AlertService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly conceptPipe = inject(EconomicConceptPipe);
  readonly confirmationService = inject(ConfirmationService);

  protected readonly invoiceFormHelper = new FormHelper();
  protected readonly allowedFiles = FileUtils.getAllowedExtensions('IMG', 'PDF');
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;

  private readonly saveButton: MenuItem = {label: "Guardar y cerrar", command: () => this.onSubmit()};
  private readonly saveButtonAndContinue: MenuItem = {label: "Guardar y seguir", command: () => this.onSubmit(true)};

  protected expenseTypes!: InvoiceConceptType[];
  protected grants!: InvoiceGrant[];
  protected payers!: InvoicePayer[];
  protected readonly paymentMethods = [
    "EFECTIVO",
    "TRANSFERENCIA BANCARIA",
    "RECIBO",
    "TARJETA BANCARIA",
    "TARJETA CAIXA"
  ];

  protected invoiceToUpdate: Invoice | undefined;
  private dateHasBeenSelected = false;

  protected buttons: MenuItem[] | undefined;
  protected saveAndContinue: boolean = false;

  protected saveLoading: boolean = false;
  protected deleteLoading: boolean = false;
  protected documentsLoading = false;
  protected defaultDate = new Date();

  private readonly uploader = viewChild.required(FileUpload);

  private autoCompleteOptions!: IssuerNif[];
  protected issuerSuggestions: IssuerNif[] = [];
  protected nifSuggestions: IssuerNif[] = [];
  protected nifFilter: RegExp = /[A-Za-z0-9?]/;

  ngOnInit(): void {
    if (this.config.data) {
      this.expenseTypes = this.config.data.invoiceData.expenseTypes.map((expense: InvoiceConceptType) => this.transformConceptName(expense));
      this.grants = this.config.data.invoiceData.grants;
      this.payers = this.config.data.invoiceData.payers;
      this.autoCompleteOptions = this.config.data.invoiceData.autocompleteOptions;
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

  protected searchIssuer(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.issuerSuggestions = this.autoCompleteOptions
      .filter(item => item.issuer.toLowerCase().includes(query));
  }

  protected searchNif(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.nifSuggestions = this.autoCompleteOptions
      .filter(item => item.nif.toLowerCase().includes(query));
  }

  protected onAutoCompleteSelect(event: AutoCompleteSelectEvent) {
    this.invoiceFormHelper.get("issuer")?.setValue(event.value.issuer);
    this.invoiceFormHelper.get("nif")?.setValue(event.value.nif);
  }

  private transformConceptName(concept: InvoiceConceptType): InvoiceConceptType {
    concept.description = this.conceptPipe.transform(concept);
    return concept;
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
    if (this.invoiceFormHelper.validateAll()) {
      const invoice: Invoice = {...this.invoiceFormHelper.value};
      invoice.amount *= 100;
      invoice.invoiceDate = DateUtils.toLocalDate(invoice.invoiceDate);
      invoice.paymentDate = DateUtils.toLocalDate(invoice.paymentDate);
      invoice.nif = invoice.nif.toUpperCase();
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
    const existingSuggestion = this.autoCompleteOptions.find(suggestion => suggestion.nif === invoice.nif);
    if (existingSuggestion) {
      existingSuggestion.nif = invoice.nif;
      existingSuggestion.issuer = invoice.issuer;
    } else {
      this.autoCompleteOptions.push({issuer: invoice.issuer, nif: invoice.nif});
    }

    this.defaultDate = new Date(invoice.invoiceDate);

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
