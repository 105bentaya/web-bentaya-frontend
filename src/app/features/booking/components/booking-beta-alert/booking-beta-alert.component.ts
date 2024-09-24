import {Component} from '@angular/core';
import {PrimeTemplate} from "primeng/api";
import {MessagesModule} from "primeng/messages";

@Component({
  selector: 'app-booking-beta-alert',
  standalone: true,
  imports: [
    PrimeTemplate,
    MessagesModule
  ],
  templateUrl: './booking-beta-alert.component.html',
  styleUrl: './booking-beta-alert.component.scss'
})
export class BookingBetaAlertComponent {
}
