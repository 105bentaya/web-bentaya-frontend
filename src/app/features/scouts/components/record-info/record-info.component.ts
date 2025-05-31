import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ScoutFile, ScoutRecord} from "../../models/member.model";
import {Button} from "primeng/button";
import {DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {DocumentListComponent} from "../document-list/document-list.component";
import {noop, Observable} from "rxjs";
import {ScoutService} from "../../services/scout.service";
import {RecordFormComponent} from "../record-form/record-form.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {assign} from "lodash";

@Component({
  selector: 'app-record-info',
  imports: [
    Button,
    DatePipe,
    TableModule,
    DocumentListComponent
  ],
  templateUrl: './record-info.component.html',
  styleUrl: './record-info.component.scss'
})
export class RecordInfoComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly scoutService = inject(ScoutService);

  protected record!: ScoutRecord;
  private scoutId!: number;

  protected loading = false;

  ngOnInit() {
    this.record = this.config.data.record;
    this.scoutId = this.config.data.scoutId;
  }

  protected openFormDialog() {
    const ref = this.dialogService.openDialog(
      RecordFormComponent,
      "Editar Expediente",
      "small",
      {record: this.record, scoutId: this.scoutId}
    );
    ref.onClose.subscribe(result => result ? this.updateRecord(result) : noop());
  }

  private updateRecord(result: ScoutRecord | -1) {
    if (result === -1) {
      this.ref.close(true);
    } else {
      assign(this.record, result);
    }
  }

  protected readonly deletePetition = (fileId: number) => {
    return this.scoutService.deleteDocument(this.record.id, fileId, "RECORD");
  };

  protected readonly uploadPetition = (file: File): Observable<ScoutFile> => {
    return this.scoutService.uploadDocument(this.record.id, file, "RECORD");
  };
}
