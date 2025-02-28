import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-radio-button-container',
  imports: [
    NgClass
  ],
  templateUrl: './radio-button-container.component.html',
  styleUrl: './radio-button-container.component.scss'
})
export class RadioButtonContainerComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() required = false;
}
