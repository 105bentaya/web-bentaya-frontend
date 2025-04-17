import {Component, input, model, OnChanges, SimpleChanges} from '@angular/core';
import {Dialog} from "primeng/dialog";
import {BookingDocumentType} from "../../model/booking-document.model";

@Component({
  selector: 'app-booking-document-help',
  imports: [
    Dialog
  ],
  templateUrl: './booking-document-help.component.html',
  styleUrl: './booking-document-help.component.scss'
})
export class BookingDocumentHelpComponent implements OnChanges {
  show = model.required<boolean>();
  types = input.required<BookingDocumentType[]>();

  protected permanentTypes: BookingDocumentType[] = [];
  protected expirableTypes: BookingDocumentType[] = [];
  protected singleUseTypes: BookingDocumentType[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes["types"] && this.types()?.length > 0) {
      this.permanentTypes = this.types().filter(type => type.usualDuration === "PERMANENT");
      this.expirableTypes = this.types().filter(type => type.usualDuration === "EXPIRABLE");
      this.singleUseTypes = this.types().filter(type => type.usualDuration === "SINGLE_USE");
    }
  }
}
