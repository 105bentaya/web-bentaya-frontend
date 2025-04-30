import {Component, inject, input} from '@angular/core';
import {JuridicalPersonalData, Member, MemberFile, RealPersonalData} from '../../models/member.model';
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
  member = input.required<Member>();
  readonly scoutService = inject(ScoutService);

  get isRealPerson(): boolean {
    return this.member().type === "REAL";
  }

  get realPersonalData(): RealPersonalData {
    return this.member().personalData as RealPersonalData;
  }

  get juridicalPersonalData(): JuridicalPersonalData {
    return this.member().personalData as JuridicalPersonalData;
  }

  get filePetition(): (file: File) => Observable<MemberFile> {
    return (file: File) => this.scoutService.uploadPersonalDataDocs(this.member().id, file);
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deletePersonalDataDocs(this.member().id, fileId);
  }
}
