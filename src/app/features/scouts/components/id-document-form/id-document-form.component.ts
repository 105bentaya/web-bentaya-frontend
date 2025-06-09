import {Component, input, OnInit} from '@angular/core';
import {FloatLabel} from "primeng/floatlabel";
import {Select} from "primeng/select";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {idTypes} from "../../../../shared/constant";

@Component({
  selector: 'app-id-document-form',
  imports: [
    FloatLabel,
    Select,
    ReactiveFormsModule,
    InputText
  ],
  templateUrl: './id-document-form.component.html',
  styleUrl: './id-document-form.component.scss'
})
export class IdDocumentFormComponent implements OnInit {
  parentForm = input.required<FormGroup | AbstractControl>();
  idDocumentGroupName = input<string>('idDocument');
  colClass = input<string>('col-12');
  rowClass = input<string>('row');
  labelClass = input<'' | 'semi-required' | 'required'>('');

  protected readonly idTypes = idTypes;

  ngOnInit(): void {
    const control = this.idDocumentGroup.get('idType');
    if (!control?.value) {
      this.idDocumentGroup.get('number')?.disable();
    }
  }

  protected get idDocumentGroup(): FormGroup {
    return this.parentForm().get(this.idDocumentGroupName()) as FormGroup;
  }

  protected get idType(): FormControl {
    return this.idDocumentGroup.get('idType') as FormControl;
  }

  protected get number(): FormControl {
    return this.idDocumentGroup.get('number') as FormControl;
  }

  protected onIdTypeChange(): void {
    const numberControl = this.idDocumentGroup.get('number');
    numberControl?.enable();
    numberControl?.updateValueAndValidity();
  }

  protected onIdTypeClear(): void {
    const numberControl = this.idDocumentGroup.get('number');
    numberControl?.setValue(undefined);
    numberControl?.disable();
  }
}
