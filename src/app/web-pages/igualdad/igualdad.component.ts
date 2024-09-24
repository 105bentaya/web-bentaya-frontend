import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-igualdad',
  templateUrl: './igualdad.component.html',
  styleUrls: ['./igualdad.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink
  ]
})
export class IgualdadComponent {
}
