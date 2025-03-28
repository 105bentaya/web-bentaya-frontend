import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {ScoutCenterInformation} from "../../../features/scout-center/scout-center.model";
import {ScoutCenterService} from "../../../features/scout-center/scout-center.service";

@Component({
  selector: 'app-flex-card',
  templateUrl: './flex-card.component.html',
  styleUrls: ['./flex-card.component.scss'],
  imports: [NgClass]
})
export class FlexCardComponent {

  protected scoutCenterService = inject(ScoutCenterService);
  protected selectedIndex: number = 0;
  @Input() options: ScoutCenterInformation[] = [];
  @Output() selectedIndexEvent = new EventEmitter<number>();

  protected selectOption(index: number) {
    this.selectedIndex = index;
    this.selectedIndexEvent.emit(index);
  }
}
