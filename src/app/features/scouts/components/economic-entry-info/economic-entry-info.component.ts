import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {EconomicEntry} from "../../models/scout.model";
import {EconomicEntryFormComponent} from "../economic-entry-form/economic-entry-form.component";
import {noop} from "rxjs";
import {assign} from "lodash";

@Component({
  selector: 'app-economic-entry-info',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './economic-entry-info.component.html',
  styleUrl: './economic-entry-info.component.scss'
})
export class EconomicEntryInfoComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly ref = inject(DynamicDialogRef);

  protected entry!: EconomicEntry;
  private scoutId!: number;

  protected loading = false;

  ngOnInit() {
    this.entry = this.config.data.entry;
    this.scoutId = this.config.data.scoutId;
  }

  protected openFormDialog() {
    const ref = this.dialogService.openDialog(
      EconomicEntryFormComponent,
      "Editar Apunte",
      "small",
      {scoutId: this.scoutId, entry: this.entry}
    );
    ref.onClose.subscribe(result => result ? this.updateEntry(result) : noop());
  }

  private updateEntry(result: EconomicEntry | -1) {
    if (result === -1) {
      this.ref.close(true);
    } else {
      assign(this.entry, result);
    }
  }
}
