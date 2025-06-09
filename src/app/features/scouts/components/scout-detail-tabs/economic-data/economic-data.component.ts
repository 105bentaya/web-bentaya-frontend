import {Component, inject, input} from '@angular/core';
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {ScoutEconomicData, EconomicEntry, ScoutPersonalData, Scout, ScoutContact, ScoutFile} from "../../../models/scout.model";
import {DialogService} from "primeng/dynamicdialog";
import {BasicInfoComponent} from "../../basic-info/basic-info.component";
import {CensusPipe} from "../../../pipes/census.pipe";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {IdDocumentPipe} from "../../../pipes/id-document.pipe";
import {IdDocumentTypePipe} from "../../../pipes/id-document-type.pipe";
import {DocumentListComponent} from "../../document-list/document-list.component";
import {noop, Observable} from "rxjs";
import {ScoutService} from "../../../services/scout.service";
import {EconomicEntryFormComponent} from "../../scout-detail-forms/economic-entry-form/economic-entry-form.component";
import {EconomicEntryInfoComponent} from "../economic-entry-info/economic-entry-info.component";

@Component({
  selector: 'app-economic-data',
  imports: [
    BasicInfoComponent,
    CensusPipe,
    TableModule,
    Tag,
    IdDocumentPipe,
    IdDocumentTypePipe,
    DocumentListComponent
  ],
  templateUrl: './economic-data.component.html',
  styleUrl: './economic-data.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class EconomicDataComponent {
  private readonly dialogService = inject(DynamicDialogService);
  private readonly scoutService = inject(ScoutService);

  public scout = input.required<Scout>();

  protected get economicData(): ScoutEconomicData {
    return this.scout().economicData;
  }

  protected get donor(): ScoutContact | ScoutPersonalData {
    return this.scout().contactList.find(contact => contact.donor) ?? this.scout().personalData;
  }

  protected get donorCompanyName(): string | undefined {
    const contact = this.donor as ScoutContact;
    return contact?.personType === 'JURIDICAL' ? contact.companyName : undefined;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadDocument(this.scout().id, file, "ECONOMIC");
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteDocument(this.scout().id, fileId, "ECONOMIC");
  }

  protected openEntryForm() {
    const ref = this.dialogService.openDialog(EconomicEntryFormComponent, "Añadir Apunte", "small", {scoutId: this.scout().id});
    ref.onClose.subscribe(result => {
      if (result) {
        const list = this.economicData.entries;
        list.push(result);
        this.openEntryInfo(result, list.length - 1);
      }
    });
  }

  protected openEntryInfo(entry: EconomicEntry, index: number) {
    const ref = this.dialogService.openDialog(
      EconomicEntryInfoComponent,
      "Expediente",
      "small",
      {entry, scoutId: this.scout().id}
    );
    ref.onClose.subscribe(deleted => deleted ? this.economicData.entries.splice(index, 1) : noop());
  }

}
