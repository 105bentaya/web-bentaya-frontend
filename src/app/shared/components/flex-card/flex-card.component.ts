import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-flex-card',
  templateUrl: './flex-card.component.html',
  styleUrls: ['./flex-card.component.scss'],
  imports: [NgClass]
})
export class FlexCardComponent {
  @Input() options: { mainText: string; subText: string; backgroundImageUrl: string; iconClass: string }[] = [];
  @Output() selectedIndexEvent = new EventEmitter<number>();
  selectedIndex: number = 0;

  protected selectOption(index: number) {
    this.selectedIndex = index;
    this.selectedIndexEvent.emit(index);
  }
}
