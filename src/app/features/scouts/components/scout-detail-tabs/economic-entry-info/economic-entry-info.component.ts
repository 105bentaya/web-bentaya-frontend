import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {EconomicEntry} from "../../../models/scout.model";
import {EconomicEntryFormComponent} from "../../scout-detail-forms/economic-entry-form/economic-entry-form.component";
import {noop} from "rxjs";
import {assign} from "lodash";
import {Router} from "@angular/router";
import {EntryTypePipe} from "../../../pipes/entry-type.pipe";
import {IdDocumentTypePipe} from "../../../pipes/id-document-type.pipe";
import {IdDocumentPipe} from "../../../pipes/id-document.pipe";

@Component({
  selector: 'app-economic-entry-info',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    EntryTypePipe,
    IdDocumentTypePipe,
    IdDocumentPipe
  ],
  templateUrl: './economic-entry-info.component.html',
  styleUrl: './economic-entry-info.component.scss'
})
export class EconomicEntryInfoComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly router = inject(Router);

  protected entry!: EconomicEntry;
  private scoutId!: number;
  protected editable = false;
  protected showRoute = false;

  protected loading = false;

  ngOnInit() {
    this.entry = this.config.data.entry;
    this.scoutId = this.config.data.scoutId;
    this.editable = this.config.data.editable;
    this.showRoute = this.config.data.showRoute;
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

  protected navigateToScout() {
    this.router.navigate(["scouts", this.scoutId], {queryParams: {tab: 'economico'}}).then(() => this.ref.close());
  }
}
