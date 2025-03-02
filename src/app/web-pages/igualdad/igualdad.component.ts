import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {GeneralAButtonComponent} from "../../shared/components/buttons/general-a-button/general-a-button.component";

@Component({
  selector: 'app-igualdad',
  templateUrl: './igualdad.component.html',
  styleUrls: ['./igualdad.component.scss'],
  imports: [
    RouterLink,
    GeneralAButtonComponent
  ]
})
export class IgualdadComponent {
}
