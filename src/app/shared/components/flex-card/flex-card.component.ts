import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {ScoutCenter} from "../../../features/booking/model/scout-center.model";

@Component({
  selector: 'app-flex-card',
  templateUrl: './flex-card.component.html',
  styleUrls: ['./flex-card.component.scss'],
  imports: [NgClass]
})
export class FlexCardComponent {
  @Input() options: { scoutCenter: ScoutCenter; extras: {icon: string, image: string} }[] = [];
  @Output() selectedIndexEvent = new EventEmitter<number>();
  protected selectedIndex: number = 0;

  protected selectOption(index: number) {
    this.selectedIndex = index;
    this.selectedIndexEvent.emit(index);
  }
}
