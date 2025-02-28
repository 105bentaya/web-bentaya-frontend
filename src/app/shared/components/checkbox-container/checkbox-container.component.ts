import {Component, Input} from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-checkbox-container',
  imports: [
    CheckboxModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './checkbox-container.component.html',
  styleUrl: './checkbox-container.component.scss'
})
export class CheckboxContainerComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() privacy = false;
  @Input() required = false;
}
