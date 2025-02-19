import {Component} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {socialMediaButtons} from "../../shared/constant";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [RouterLink, ButtonModule, DividerModule]
})
export class FooterComponent {
  protected readonly socialMediaButtons = socialMediaButtons;
}
