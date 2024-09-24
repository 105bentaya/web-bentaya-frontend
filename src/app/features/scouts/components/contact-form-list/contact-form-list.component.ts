import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {
  GeneralIconButtonComponent
} from "../../../../shared/components/general-icon-button/general-icon-button.component";

@Component({
  selector: 'app-contact-form-list',
  templateUrl: './contact-form-list.component.html',
  styleUrls: ['./contact-form-list.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    GeneralIconButtonComponent
  ]
})
export class ContactFormListComponent {
  @Input() contactList!: FormArray;
  @Input() formGroup!: FormGroup;
  @Output() onAdd = new EventEmitter<void>;
  @Output() onDelete = new EventEmitter<number>;
}
