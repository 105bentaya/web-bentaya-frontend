import { Component } from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-privacy-checkbox-container',
  standalone: true,
  imports: [
    CheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './privacy-checkbox-container.component.html',
  styleUrl: './privacy-checkbox-container.component.scss'
})
export class PrivacyCheckboxContainerComponent {

}
