import {Component} from '@angular/core';
import {generalEmail} from "../../shared/constant";

@Component({
  selector: 'app-aviso-legal',
  templateUrl: './aviso-legal.component.html',
  styleUrls: ['./aviso-legal.component.scss'],
  standalone: true
})
export class AvisoLegalComponent {
  protected readonly generalEmail = generalEmail;
}
