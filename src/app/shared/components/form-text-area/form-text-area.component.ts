import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {TagModule} from 'primeng/tag';
import {InputTextModule} from 'primeng/inputtext';
import {NgClass} from '@angular/common';

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
    NgClass,
    InputTextModule,
    FormsModule,
    TagModule
  ]
})
export class FormTextAreaComponent implements OnInit, ControlValueAccessor {

  //todo: ng-invalid not working
  value!: string;
  valueLength = 0;

  @Input()
  maxLength: number = 256;
  @Input()
  formControlName!: string;
  @Input()
  ngClass: any;
  @Input()
  showErrorMessage = false;
  @Input()
  rows: string = '4';
  @Input()
  floatLabel?: string;
  @Input()
  labelClass: string = "";
  @Input()
  disabled: boolean = false;


  @Output()
  isValid = new EventEmitter<boolean>();

  textIsUnderLimit = true;

  _onChange: any = () => {
  };
  _onTouched: any = () => {
  };

  constructor() {
  }

  ngOnInit(): void {
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
