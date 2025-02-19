import {Component} from '@angular/core';
import {ImageModule} from 'primeng/image';
import {ButtonDirective} from 'primeng/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-donation-menu',
  templateUrl: './donation-menu.component.html',
  styleUrls: ['./donation-menu.component.scss'],
  imports: [
    RouterLink,
    ImageModule,
    ButtonDirective
  ]
})
export class DonationMenuComponent {
}
