import {Component, inject, input} from '@angular/core';
import {ScoutPersonalData, Scout, ScoutFile} from '../../models/member.model';
import {BasicInfoComponent} from "../basic-info/basic-info.component";
import {DatePipe} from "@angular/common";
import {IdDocumentPipe} from "../../id-document.pipe";
import {IdDocumentTypePipe} from "../../id-document-type.pipe";
import {DocumentListComponent} from "../document-list/document-list.component";
import {AgePipe} from "../../age.pipe";
import {ScoutService} from "../../services/scout.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-personal-data',
  imports: [
    BasicInfoComponent,
    DatePipe,
    IdDocumentPipe,
    IdDocumentTypePipe,
    DocumentListComponent,
    AgePipe,

  ],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss'
})
export class PersonalDataComponent {
  scout = input.required<Scout>();
  readonly scoutService = inject(ScoutService);

  get personalData(): ScoutPersonalData {
    return this.scout().personalData;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadDocument(this.scout().id, file, "PERSONAL");
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteDocument(this.scout().id, fileId, "PERSONAL");
  }
}
