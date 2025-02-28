import {Component} from '@angular/core';
import {ImageModule} from 'primeng/image';
import {RouterLink} from '@angular/router';
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";

@Component({
  selector: 'app-donation-menu',
  templateUrl: './donation-menu.component.html',
  styleUrls: ['./donation-menu.component.scss'],
  imports: [
    RouterLink,
    ImageModule,
    GeneralAButtonComponent
  ]
})
export class DonationMenuComponent {
}
