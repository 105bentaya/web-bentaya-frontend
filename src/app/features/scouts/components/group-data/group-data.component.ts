import {Component, inject, input} from '@angular/core';
import {Scout, ScoutInfo, ScoutRecord} from "../../models/scout.model";
import {BasicInfoComponent} from "../basic-info/basic-info.component";
import {CensusPipe} from "../../census.pipe";
import {DatePipe, TitleCasePipe} from "@angular/common";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";
import {BasicInfoShowComponent} from "../basic-info-show/basic-info-show.component";
import {Tag} from "primeng/tag";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {RecordFormComponent} from "../record-form/record-form.component";
import {TableModule} from "primeng/table";
import {RecordInfoComponent} from "../record-info/record-info.component";
import {noop} from "rxjs";
import {SpecialRolePipe} from "../../../special-member/special-role.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-group-data',
  imports: [
    BasicInfoComponent,
    CensusPipe,
    TitleCasePipe,
    BooleanPipe,
    DatePipe,
    BasicInfoShowComponent,
    Tag,
    TableModule,
    SpecialRolePipe,
    RouterLink
  ],
  templateUrl: './group-data.component.html',
  styleUrl: './group-data.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class GroupDataComponent {

  private readonly dialogService = inject(DynamicDialogService);

  public scout = input.required<Scout>();
  protected showDates: boolean = false;

  protected get scoutInfo(): ScoutInfo {
    return this.scout().scoutInfo;
  }

  protected get section(): string | undefined {
    const scoutInfo = this.scout().scoutInfo;
    switch (scoutInfo.scoutType) {
      case "SCOUT":
        return scoutInfo.group!.section!;
      case "SCOUTER":
        return "Scouter";
      case "COMMITTEE":
      case "MANAGER":
        return "Scoutsupport";
      default:
        return undefined;
    }
  }

  protected get group(): string {
    const scoutInfo = this.scout().scoutInfo;
    switch (scoutInfo.scoutType) {
      case "SCOUT":
        return scoutInfo.group!.name;
      case "SCOUTER":
        return "Kraal";
      case "COMMITTEE":
        return "Almogaren";
      case "MANAGER":
        return "Tagoror";
      case "INACTIVE":
        return "Guatatiboa";
      default:
        return "-";
    }
  }

  protected openRecordForm() {
    const ref = this.dialogService.openDialog(RecordFormComponent, "Añadir Expediente", "small", {scoutId: this.scout().id});
    ref.onClose.subscribe(result => {
      if (result) {
        const list = this.scoutInfo.recordList;
        list.push(result);
        this.openRecordInfo(result, list.length - 1);
      }
    });
  }

  protected openRecordInfo(record: ScoutRecord, index: number) {
    const ref = this.dialogService.openDialog(
      RecordInfoComponent,
      "Expediente",
      "small",
      {record, scoutId: this.scout().id}
    );
    ref.onClose.subscribe(deleted => deleted ? this.scoutInfo.recordList.splice(index, 1) : noop());
  }
}
