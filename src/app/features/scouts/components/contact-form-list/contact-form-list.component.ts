import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {FloatLabel} from "primeng/floatlabel";

@Component({
  selector: 'app-contact-form-list',
  templateUrl: './contact-form-list.component.html',
  styleUrls: ['./contact-form-list.component.scss'],
  imports: [
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    TableIconButtonComponent,
    FloatLabel
  ]
})
export class ContactFormListComponent {
  @Input() contactList!: FormArray;
  @Input() formGroup!: FormGroup;
  @Output() onAdd = new EventEmitter<void>;
  @Output() onDelete = new EventEmitter<number>;
}
