import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";

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
}
