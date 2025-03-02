import {Component} from '@angular/core';
import {maintenanceEmail} from "../../../../shared/constant";
import {Message} from "primeng/message";

@Component({
  selector: 'app-booking-beta-alert',
  imports: [
    Message
  ],
  templateUrl: './booking-beta-alert.component.html',
  styleUrl: './booking-beta-alert.component.scss'
})
export class BookingBetaAlertComponent {
  protected readonly maintenanceEmail = maintenanceEmail;
}
