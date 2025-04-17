import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {Invoice} from "../../invoice.model";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";
import {CurrencyPipe, DatePipe, TitleCasePipe} from "@angular/common";
import {Button} from "primeng/button";
import {InvoiceFormComponent} from "../invoice-form/invoice-form.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {finalize, forkJoin} from "rxjs";
import {InvoiceService} from "../../invoice.service";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {FileUtils, imageAndPdfTypes} from "../../../../shared/util/file.utils";

@Component({
  selector: 'app-invoice-detail',
  imports: [
    BooleanPipe,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Button,
    FileUpload,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly imageAndPdfTypes = imageAndPdfTypes;

  protected invoice!: Invoice;
  private invoiceData: any;
  protected loading = false;

  ngOnInit(): void {
    if (this.config.data?.invoice) {
      this.invoice = this.config.data.invoice;
      this.invoiceData = this.config.data.invoiceData;
    } else {
      this.alertService.sendBasicErrorMessage("No se han cargado los datos de la factura");
      this.ref.close();
    }
  }

  protected openInvoiceDialog() {
    const ref = this.dialogService.openDialog(
      InvoiceFormComponent,
      'Editar Factura',
      "small",
      {invoiceData: this.invoiceData, invoice: this.invoice}
    );
    ref.onClose.subscribe(changes => {
      if (changes === "deleted") {
        this.ref.close();
      } else if (changes === "saved") {
        this.reloadInvoice();
      }
    });
  }

  protected uploadFile(event: FileUploadHandlerEvent, uploader: FileUpload) {
    const fileUploadPetitions = event.files.map(file => this.invoiceService.uploadFile(this.invoice.id, file));
    this.loading = true;
    forkJoin(fileUploadPetitions)
      .pipe(finalize(() => {
        this.reloadInvoice();
        uploader.clear();
        this.loading = false;
      }))
      .subscribe({
        complete: () => this.alertService.sendBasicSuccessMessage("Documentos subidos correctamente")
      });
  }

  protected openFile(fileId: number) {
    FileUtils.openFile(this.invoiceService.getFileUrl(fileId));
  }

  protected downloadFile(fileId: number, button: Button) {
    this.loading = true;
    button.loading = true;
    this.invoiceService.getFileUrl(fileId)
      .pipe(finalize(() => {
        this.loading = false;
        button.loading = false;
      })).subscribe(response => FileUtils.downloadFile(response));
  }

  protected deleteFileConfirmation(fileId: number, button: Button) {
    this.confirmationService.confirm({
      message: "¿Desea borrar este archivo? Esta acción no se puede revertir.",
      header: "Borrar archivo",
      accept: () => this.deleteFile(fileId, button)
    });
  }

  private deleteFile(fileId: number, button: Button) {
    this.loading = true;
    button.loading = true;

    this.invoiceService.deleteFile(fileId)
      .pipe(finalize(() => {
        this.loading = false;
        button.loading = false;
      }))
      .subscribe(() => {
        this.alertService.sendBasicSuccessMessage("Archivo eliminado correctamente");
        this.invoice.files.splice(this.invoice.files.findIndex(doc => doc.id === fileId), 1);
      });
  }

  private reloadInvoice() {
    this.invoiceService.getById(this.invoice.id).subscribe(result => this.invoice = result);
  }
}
