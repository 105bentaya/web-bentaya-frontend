import {Component, inject, Input, model} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import {ScoutCenterInformation} from "../../../features/scout-center/scout-center.model";
import {ScoutCenterService} from "../../../features/scout-center/scout-center.service";

@Component({
  selector: 'app-flex-card',
  templateUrl: './flex-card.component.html',
  styleUrls: ['./flex-card.component.scss'],
  imports: [NgClass, NgStyle]
})
export class FlexCardComponent {

  protected scoutCenterService = inject(ScoutCenterService);
  selectedIndex = model<number>(0);
  @Input() options: ScoutCenterInformation[] = [];

  protected selectOption(index: number) {
    this.selectedIndex.set(index);
  }
}
