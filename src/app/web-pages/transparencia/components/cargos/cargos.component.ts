import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {moneyEmail, presidencyEmail, secretaryEmail, viceEmail} from "../../../../shared/constant";

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss'],
  imports: [
    RouterLink
  ],
  standalone: true
})
export class CargosComponent {
  protected readonly moneyEmail = moneyEmail;
  protected readonly viceEmail = viceEmail;
  protected readonly presidencyEmail = presidencyEmail;
  protected readonly secretaryEmail = secretaryEmail;
}
