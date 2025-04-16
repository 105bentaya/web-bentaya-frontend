import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {SaveButtonsComponent} from "../save-buttons/save-buttons.component";
import {FormHelper} from "../../../util/form-helper";

@Component({
  selector: 'app-large-form-buttons',
  imports: [
    SaveButtonsComponent,
    Button
  ],
  templateUrl: './large-form-buttons.component.html',
  styleUrl: './large-form-buttons.component.scss'
})
export class LargeFormButtonsComponent {
  @Input() form!: FormHelper;
  @Input() loading!: boolean;
  @Input() showPrevAtFirstPage = false;
  @Input() showStartButton = true;
  @Output() onSubmit = new EventEmitter<void>();
}
