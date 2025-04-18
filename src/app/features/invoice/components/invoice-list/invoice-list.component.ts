import {Component, inject, OnInit, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {PrimeTemplate} from "primeng/api";
import {Table, TableLazyLoadEvent, TableModule} from "primeng/table";
import {InvoiceService} from "../../invoice.service";
import {Invoice, InvoiceData} from "../../invoice.model";
import {CurrencyPipe, DatePipe} from "@angular/common";
import FilterUtils from "../../../../shared/util/filter-utils";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {InvoiceDetailComponent} from "../invoice-detail/invoice-detail.component";
import {InvoiceFormComponent} from "../invoice-form/invoice-form.component";
import {cloneDeep} from "lodash";
import {noop} from "rxjs";
import {DatePicker} from "primeng/datepicker";
import {FormsModule} from "@angular/forms";
import {DateUtils} from "../../../../shared/util/date-utils";


@Component({
  selector: 'app-invoice-list',
  imports: [
    InputTextModule,
    MultiSelectModule,
    PrimeTemplate,
    TableModule,
    CurrencyPipe,
    Button,
    DatePipe,
    DatePicker,
    FormsModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class InvoiceListComponent implements OnInit {

  private readonly invoiceService = inject(InvoiceService);
  private readonly dialogService = inject(DynamicDialogService);

  protected invoices!: Invoice[];
  protected invoiceData!: InvoiceData;
  protected totalRecords: number = 0;
  protected loading = true;

  protected dateRange: Date[] | undefined;
  private lastFilter: TableLazyLoadEvent | undefined;
  private readonly table = viewChild.required(Table);

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.invoiceService.getData().subscribe(invoiceData => this.invoiceData = invoiceData);
  }

  protected loadUsersWithFilter(tableLazyLoadEvent: any) {
    this.lastFilter = tableLazyLoadEvent;
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

  protected openInvoiceFormDialog() {
    const ref = this.dialogService.openDialog(
      InvoiceFormComponent,
      'Añadir Factura',
      "small",
      {invoiceData: cloneDeep(this.invoiceData), allowMultipleAdding: true}
    );
    this.onRefClose(ref);
  }

  protected openInvoiceDetailDialog(invoice: Invoice) {
    const ref = this.dialogService.openDialog(
      InvoiceDetailComponent,
      'Factura',
      "small",
      {invoice, invoiceData: cloneDeep(this.invoiceData)}
    );
    this.onRefClose(ref);
  }

  protected onRefClose(ref: DynamicDialogRef) {
    ref.onClose.subscribe(() => {
      if (this.invoiceService.hasBeenAnUpdate()) {
        this.lastFilter ? this.loadUsersWithFilter(this.lastFilter) : noop();
        this.getData();
      }
    });
  }

  protected filterDates() {
    if (this.dateRange?.[0]) {
      const startDate = DateUtils.toLocalDate(this.dateRange[0]);
      const endDate = DateUtils.toLocalDate(this.dateRange?.[1] ? this.dateRange[1] : this.dateRange[0]);
      this.table().filter([startDate, endDate], "filterDates", "custom");
    } else {
      this.table().filter(null, "filterDates", "custom");
    }
  }
}
