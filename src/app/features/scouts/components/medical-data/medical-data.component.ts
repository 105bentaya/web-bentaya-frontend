import {Component, inject, input} from '@angular/core';
import {Scout, ScoutFile, ScoutMedicalData} from "../../models/scout.model";
import {BasicInfoComponent} from "../basic-info/basic-info.component";
import {IdDocumentPipe} from "../../id-document.pipe";
import {IdDocumentTypePipe} from "../../id-document-type.pipe";
import {DocumentListComponent} from "../document-list/document-list.component";
import {Observable} from "rxjs";
import {ScoutService} from "../../services/scout.service";
import {BloodTypePipe} from "../../blood-type.pipe";
import {NgClass} from "@angular/common";
import {BasicInfoShowComponent} from "../basic-info-show/basic-info-show.component";

@Component({
  selector: 'app-medical-data',
  imports: [
    BasicInfoComponent,
    IdDocumentPipe,
    IdDocumentTypePipe,
    DocumentListComponent,
    BloodTypePipe,
    NgClass,
    BasicInfoShowComponent
  ],
  templateUrl: './medical-data.component.html',
  styleUrl: './medical-data.component.scss'
})
export class MedicalDataComponent {

  private readonly scoutService = inject(ScoutService);

  scout = input.required<Scout>();

  protected showSocialHolder = false;
  protected showPrivateHolder = false;

  get medicalData(): ScoutMedicalData {
    return this.scout().medicalData;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadDocument(this.scout().id, file, "MEDICAL");
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteDocument(this.scout().id, fileId, "MEDICAL");
  }
}
