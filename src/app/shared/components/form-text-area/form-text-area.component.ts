import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {TagModule} from 'primeng/tag';
import {InputTextModule} from 'primeng/inputtext';
import {Textarea} from "primeng/textarea";

@Component({
  selector: 'app-form-text-area',
  templateUrl: './form-text-area.component.html',
  styleUrls: ['./form-text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FormTextAreaComponent),
    }
  ],
  imports: [
    InputTextModule,
    FormsModule,
    TagModule,
    Textarea
  ]
})
export class FormTextAreaComponent implements OnInit, ControlValueAccessor {

  protected value!: string;
  protected valueLength = 0;
  protected textIsUnderLimit = true;

  @Input() showTag: boolean = true;
  @Input() maxLength: number = 256;
  @Input() formControlName!: string;
  @Input() showErrorMessage = false;
  @Input() rows: string = '4';
  @Input() disabled: boolean = false;
  @Output() isValid = new EventEmitter<boolean>();

  _onChange: any = () => {
  };
  _onTouched: any = () => {
  };

  constructor() {
  }

  ngOnInit(): void {
    this.showErrorMessage = this.showErrorMessage || !this.showTag;
    this.isValid.emit(true);
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.valueLength = obj ? obj.length : 0;
  }

  onChange(value: any) {
    this._onChange(value);
    this.valueLength = 0;
    this.valueLength = value ? value.length : 0;
    this.checkValidation();
  }

  private checkValidation() {
    if (this.valueLength <= this.maxLength != this.textIsUnderLimit) {
      this.textIsUnderLimit = !this.textIsUnderLimit;
      this.isValid.emit(this.textIsUnderLimit);
    }
  }
}
