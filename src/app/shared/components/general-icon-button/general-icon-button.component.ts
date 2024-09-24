import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-general-icon-button',
  standalone: true,
  imports: [
    ButtonDirective,
    NgClass
  ],
  templateUrl: './general-icon-button.component.html',
  styleUrl: './general-icon-button.component.scss'
})
export class GeneralIconButtonComponent {
  @Input() class!: string;
  @Input() style!: string;
  @Input() icon!: string;
  @Input() title!: string;
  @Input() type: 'button' | 'submit' | 'reset' = "button";
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>;
}

//todo implement everywhere
