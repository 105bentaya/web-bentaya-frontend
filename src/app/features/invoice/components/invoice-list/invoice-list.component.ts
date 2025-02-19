import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {InvoiceService} from "../../invoice.service";
import {Invoice, InvoiceData} from "../../invoice.model";
import {CurrencyPipe, DatePipe} from "@angular/common";
import FilterUtils from "../../../../shared/util/filter-utils";
import {DialogService} from "primeng/dynamicdialog";
import {InvoiceFormComponent} from "../invoice-form/invoice-form.component";
import {cloneDeep} from "lodash";
import {AlertService} from "../../../../shared/services/alert-service.service";


@Component({
  selector: 'app-invoice-list',
  imports: [
    InputTextModule,
    MultiSelectModule,
    PrimeTemplate,
    TableModule,
    CurrencyPipe,
    Button,
    DatePipe
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  providers: [DialogService]
})
export class InvoiceListComponent implements OnInit {

  private readonly invoiceService = inject(InvoiceService);
  private readonly dialogService = inject(DialogService);
  private readonly alertService = inject(AlertService);
  private readonly confirmationService = inject(ConfirmationService);

  protected invoices!: Invoice[];
  protected invoiceData!: InvoiceData;
  protected totalRecords: number = 0;
  protected loading = true;

  @ViewChild('dt')
  private readonly dt!: Table;

  ngOnInit() {
    this.invoiceService.getData().subscribe(invoiceData => this.invoiceData = invoiceData);
  }

  protected loadUsersWithFilter(tableLazyLoadEvent: any) {
    this.loading = true;
    this.invoiceService.getAll(FilterUtils.lazyEventToFilter(tableLazyLoadEvent)).subscribe({
      next: res => {
        this.invoices = res.data;
        this.totalRecords = res.count;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  protected openInvoiceDialog(invoice?: Invoice) {
    const ref = this.dialogService.open(InvoiceFormComponent, {
      header: invoice ? 'Editar Factura' : 'Añadir Factura',
      styleClass: 'dialog-width medium-dw',
      data: {invoiceData: cloneDeep(this.invoiceData), invoice}
    });
    ref.onClose.subscribe(() => this.dt._filter());
  }

  protected askForDeletion(invoice: Invoice) {
    this.confirmationService.confirm({
      message: '¿Desea borrar esta factura? Esta acción no se podrá revertir.',
      accept: () => this.deleteInvoice(invoice.id)
    });
  }

  private deleteInvoice(id: number) {
    this.invoiceService.delete(id).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Factura borrada con éxito");
        this.dt._filter();
      }
    });
  }
}
