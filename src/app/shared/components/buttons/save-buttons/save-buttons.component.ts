import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {MenuItem} from "primeng/api";
import {SplitButton} from "primeng/splitbutton";

@Component({
  selector: 'app-save-buttons',
  imports: [
    Button,
    SplitButton
  ],
  templateUrl: './save-buttons.component.html',
  styleUrl: './save-buttons.component.scss'
})
export class SaveButtonsComponent {

  @Input() class = '';
  @Input() saveClass = '';
  @Input() saveIcon = '';
  @Input() saveSeverity!: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";

  @Input() showCancelButton = false;
  @Input() showSaveButton = true;

  @Input() cancelLoading = false;
  @Input() saveLoading = false;

  @Input() cancelDisabled = false;
  @Input() saveDisabled = false;

  @Input() cancelLabel = "Cancelar";
  @Input() saveLabel = "Guardar";

  @Input() saveSplitButtonModel: MenuItem[] | undefined;

  @Input() cancelType: "button"|"reset"|"submit" = "button";
  @Input() saveType: "button"|"reset"|"submit" = "button";

  @Input() blockOverlay = false;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

}
