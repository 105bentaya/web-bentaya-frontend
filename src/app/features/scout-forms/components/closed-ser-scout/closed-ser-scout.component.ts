import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-closed-ser-scout',
  templateUrl: './closed-ser-scout.component.html',
  styleUrls: ['./closed-ser-scout.component.scss'],
  standalone: true,
  imports: []
})
export class ClosedSerScoutComponent {
  @Input() secondYearOfClosedTerm!: number;
  @Input() error = false;
}
