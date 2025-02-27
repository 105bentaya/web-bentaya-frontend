import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {socialMediaButtons} from "../../shared/constant";
import {DividerModule} from "primeng/divider";
import {ButtonDirective, ButtonIcon} from "primeng/button";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink, DividerModule, ButtonDirective, ButtonIcon]
})
export class FooterComponent {
  protected readonly socialMediaButtons = socialMediaButtons;
}
