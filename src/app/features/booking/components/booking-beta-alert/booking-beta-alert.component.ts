import {Component} from '@angular/core';
import {PrimeTemplate} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {maintenanceEmail} from "../../../../shared/constant";

@Component({
  selector: 'app-booking-beta-alert',
  imports: [
    PrimeTemplate,
    MessagesModule
  ],
  templateUrl: './booking-beta-alert.component.html',
  styleUrl: './booking-beta-alert.component.scss'
})
export class BookingBetaAlertComponent {
  protected readonly maintenanceEmail = maintenanceEmail;
}
