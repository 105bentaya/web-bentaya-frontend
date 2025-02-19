import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button, ButtonDirective, ButtonIcon} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-table-icon-button',
  imports: [
    Button,
    ButtonDirective,
    ButtonIcon,
    RouterLink
  ],
  templateUrl: './table-icon-button.component.html',
  styleUrl: './table-icon-button.component.scss'
})
export class TableIconButtonComponent {
  @Input() class!: string;
  @Input() style: { [p: string]: any } | undefined;
  @Input() icon!: string;
  @Input() title!: string;
  @Input() type: 'button' | 'submit' | 'reset' = "button";
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>;
  @Input() severity!: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  @Input() routerLink!: string;
}
