import {Component} from '@angular/core';
import {generalEmail} from "../../shared/constant";

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.scss'],
  standalone: true
})
export class PoliticaPrivacidadComponent {
  protected readonly generalEmail = generalEmail;
}
