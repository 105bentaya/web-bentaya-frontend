import {Component, Input} from '@angular/core';
import {ButtonDirective, ButtonIcon, ButtonLabel} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-general-a-button',
  imports: [
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
    RouterLink
  ],
  templateUrl: './general-a-button.component.html',
  styleUrl: './general-a-button.component.scss'
})
export class GeneralAButtonComponent {

  @Input() class!: string;
  @Input() href!: string;
  @Input() routerLink!: string;
  @Input() icon!: string;
  @Input() label!: string;
  @Input() labelClass!: string;
  @Input() target!: string;
  @Input() disabled!: boolean;

}
