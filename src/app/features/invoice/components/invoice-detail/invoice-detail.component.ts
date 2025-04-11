import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {Invoice} from "../../invoice.model";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";
import {CurrencyPipe, DatePipe, TitleCasePipe} from "@angular/common";
import {Button} from "primeng/button";
import {InvoiceFormComponent} from "../invoice-form/invoice-form.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";

@Component({
  selector: 'app-invoice-detail',
  imports: [
    BooleanPipe,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Button
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);

  protected invoice!: Invoice;
  private invoiceData: any;

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
      } else if (changes) {
        this.invoice = changes;
      }
    });
  }
}
