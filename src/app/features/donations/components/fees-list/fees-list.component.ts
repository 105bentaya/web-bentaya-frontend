import {Component, inject, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {EconomicDonationEntry, EconomicEntry} from "../../../scouts/models/scout.model";
import {ScoutService} from "../../../scouts/services/scout.service";
import {finalize, map} from "rxjs";
import FilterUtils from "../../../../shared/util/filter-utils";
import {DatePicker} from "primeng/datepicker";
import {InputText} from "primeng/inputtext";
import {MultiSelect} from "primeng/multiselect";
import {InvoiceConceptType} from "../../../invoice/invoice.model";
import {
  EconomicEntryInfoComponent
} from "../../../scouts/components/scout-detail-tabs/economic-entry-info/economic-entry-info.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {CensusPipe} from "../../../scouts/pipes/census.pipe";
import {Button} from "primeng/button";
import {FeesFormComponent} from "../fees-form/fees-form.component";

@Component({
  selector: 'app-fees-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    PrimeTemplate,
    TableModule,
    DatePicker,
    InputText,
    MultiSelect,
    CensusPipe,
    Button
  ],
  templateUrl: './fees-list.component.html',
  styleUrl: './fees-list.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class FeesListComponent implements OnInit {
  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DynamicDialogService);

  protected fees: EconomicDonationEntry[] = [];
  protected totalRecords!: number;
  protected loading = true;

  protected donationTypes: InvoiceConceptType[] = [];
  protected readonly FilterUtils = FilterUtils;
  private lastFilter: any;

  ngOnInit() {
    this.scoutService.getDonationTypes.pipe(
      map(type => [...type.incomeTypes, ...type.expenseTypes].filter(type => type.donation))
    ).subscribe(res => this.donationTypes = res);
  }

  protected loadData(tableLazyLoadEvent: any) {
    this.loading = true;
    this.lastFilter = tableLazyLoadEvent;
    this.scoutService.getDonationEntries(FilterUtils.lazyEventToFilter(this.lastFilter))
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => {
        this.fees = result.data;
        this.totalRecords = result.count;
      });
  }

  protected openEntryInfo(entry: EconomicEntry, scoutId: number) {
    const ref = this.dialogService.openDialog(
      EconomicEntryInfoComponent,
      "Apunte",
      "small",
      {entry, scoutId: scoutId, editable: true, showRoute: true}
    );
    ref.onClose.subscribe(() => this.loadData(this.lastFilter));
  }

  protected openFeesForm() {
    const ref = this.dialogService.openDialog(
      FeesFormComponent,
      "Pasar Cuota",
      "small"
    );
    ref.onClose.subscribe(() => this.loadData(this.lastFilter));
  }
}
