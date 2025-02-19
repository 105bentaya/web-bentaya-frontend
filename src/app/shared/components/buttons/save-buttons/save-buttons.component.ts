import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";

@Component({
  selector: 'app-save-buttons',
  imports: [
    Button
  ],
  templateUrl: './save-buttons.component.html',
  styleUrl: './save-buttons.component.scss'
})
export class SaveButtonsComponent {

  @Input() class = '';
  @Input() saveClass = '';
  @Input() saveIcon = '';

  @Input() showCancelButton = false;
  @Input() showSaveButton = true;

  @Input() cancelLoading = false;
  @Input() saveLoading = false;

  @Input() cancelDisabled = false;
  @Input() saveDisabled = false;

  @Input() cancelLabel = "Cancelar";
  @Input() saveLabel = "Guardar";

  @Input() cancelType: "button"|"reset"|"submit" = "button";
  @Input() saveType: "button"|"reset"|"submit" = "button";

  @Input() blockOverlay = false;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

}
