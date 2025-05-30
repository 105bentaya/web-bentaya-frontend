import {Component, inject, input} from '@angular/core';
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {PersonalData, Scout, ScoutContact, ScoutFile, ScoutInfo} from "../../models/member.model";
import {DialogService} from "primeng/dynamicdialog";
import {BasicInfoComponent} from "../basic-info/basic-info.component";
import {CensusPipe} from "../../census.pipe";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {IdDocumentPipe} from "../../id-document.pipe";
import {IdDocumentTypePipe} from "../../id-document-type.pipe";
import {DocumentListComponent} from "../document-list/document-list.component";
import {Observable} from "rxjs";
import {ScoutService} from "../../services/scout.service";

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

  protected get scoutInfo(): ScoutInfo {
    return this.scout().scoutInfo;
  }

  protected get donor(): ScoutContact | PersonalData {
    return this.scoutInfo.contactList.find(contact => contact.donor) ?? this.scout().personalData;
  }

  protected get donorCompanyName(): string | undefined {
    const contact = this.donor as ScoutContact;
    return contact?.personType === 'JURIDICAL' ? contact.companyName : undefined;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadEconomicDocs(this.scout().id, file);
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteEconomicDocs(this.scout().id, fileId);
  }

  protected openDonationForm() {
  }
}
