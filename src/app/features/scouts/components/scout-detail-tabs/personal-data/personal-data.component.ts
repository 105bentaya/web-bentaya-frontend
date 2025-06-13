import {Component, inject, input, OnChanges, SimpleChanges} from '@angular/core';
import {Scout, ScoutFile, ScoutPersonalData} from '../../../models/scout.model';
import {BasicInfoComponent} from "../../basic-info/basic-info.component";
import {DatePipe} from "@angular/common";
import {IdDocumentPipe} from "../../../pipes/id-document.pipe";
import {IdDocumentTypePipe} from "../../../pipes/id-document-type.pipe";
import {DocumentListComponent} from "../../document-list/document-list.component";
import {AgePipe} from "../../../pipes/age.pipe";
import {ScoutService} from "../../../services/scout.service";
import {Observable} from "rxjs";
import {BooleanPipe} from "../../../../../shared/pipes/boolean.pipe";
import {Tag} from "primeng/tag";
import {Tooltip} from "primeng/tooltip";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {DialogService} from "primeng/dynamicdialog";
import {ScoutUsersFormComponent} from "../../scout-detail-forms/scout-users-form/scout-users-form.component";

type UserOwner = "Persona asociada" | "Familiar" | "Otro";

@Component({
  selector: 'app-personal-data',
  imports: [
    BasicInfoComponent,
    DatePipe,
    IdDocumentPipe,
    IdDocumentTypePipe,
    DocumentListComponent,
    AgePipe,
    BooleanPipe,
    Tag,
    Tooltip
  ],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class PersonalDataComponent implements OnChanges {
  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DynamicDialogService);

  scout = input.required<Scout>();
  editable = input<boolean>(false);

  protected usernames: { owner: UserOwner; email: string; }[] = [];
  private readonly ownerOrder = {
    "Persona asociada": 0,
    "Familiar": 1,
    "Otro": 2
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes["scout"]) {
      this.generateUsernames();
    }
  }

  private generateUsernames() {
    const scoutUsers = this.scout().usernames;
    const scoutEmail = this.personalData.email;
    const scoutContactEmails = this.scout().contactList.map(contact => contact.email ?? "");

    this.usernames = scoutUsers.map(email => {
      let owner: UserOwner;
      if (email === scoutEmail) {
        owner = "Persona asociada";
      } else if (scoutContactEmails.includes(email)) {
        owner = "Familiar";
      } else {
        owner = "Otro";
      }
      return {owner, email};
    }).sort((a, b) => {
      if (this.ownerOrder[a.owner] !== this.ownerOrder[b.owner]) {
        return this.ownerOrder[a.owner] - this.ownerOrder[b.owner];
      }
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });
  }

  get personalData(): ScoutPersonalData {
    return this.scout().personalData;
  }

  get filePetition(): (file: File) => Observable<ScoutFile> {
    return (file: File) => this.scoutService.uploadDocument(this.scout().id, file, "PERSONAL");
  }

  get deletePetition(): (fileId: number) => Observable<void> {
    return (fileId: number) => this.scoutService.deleteDocument(this.scout().id, fileId, "PERSONAL");
  }

  protected editUsers() {
    const ref = this.dialogService.openDialog(ScoutUsersFormComponent,
      `Usuarios de ${this.personalData.name}`,
      "small",
      {scout: this.scout()}
    );
    ref.onClose.subscribe(users => {
      if (users) {
        this.scout().usernames = users;
        this.generateUsernames();
      }
    });
  }
}
