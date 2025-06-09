import {Component, input} from '@angular/core';
import {ScoutContact} from "../../../models/scout.model";
import {BasicInfoComponent} from "../../basic-info/basic-info.component";
import {IdDocumentPipe} from "../../../pipes/id-document.pipe";
import {IdDocumentTypePipe} from "../../../pipes/id-document-type.pipe";
import {Tag} from "primeng/tag";
import {BooleanPipe} from "../../../../../shared/pipes/boolean.pipe";

@Component({
  selector: 'app-contact-data',
  imports: [
    BasicInfoComponent,
    IdDocumentPipe,
    IdDocumentTypePipe,
    Tag,
    BooleanPipe
  ],
  templateUrl: './contact-data.component.html',
  styleUrl: './contact-data.component.scss'
})
export class ContactDataComponent {
  contactList = input.required<ScoutContact[]>();
}
