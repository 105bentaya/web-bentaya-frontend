import {Component, inject, input} from '@angular/core';
import {PersonalData, Scout, ScoutFile} from '../../models/member.model';
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
  member = input.required<Scout>();
  readonly scoutService = inject(ScoutService);

  get personalData(): PersonalData {
    return this.member().personalData;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadDocument(this.member().id, file, "PERSONAL");
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteDocument(this.member().id, fileId, "PERSONAL");
  }
}
