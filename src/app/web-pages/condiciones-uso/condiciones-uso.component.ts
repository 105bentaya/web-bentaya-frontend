import {Component} from '@angular/core';
import {generalEmail} from "../../shared/constant";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-condiciones-uso',
  templateUrl: './condiciones-uso.component.html',
  styleUrls: ['./condiciones-uso.component.scss'],
  standalone: true
})
export class CondicionesUsoComponent {
  protected readonly generalEmail = generalEmail;
  protected readonly environment = environment;
}
