import { Component } from '@angular/core';
import {maintenanceEmail} from "../../../shared/constant";

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  protected readonly maintenanceEmail = maintenanceEmail;
}
