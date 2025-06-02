import {Component, input} from '@angular/core';
import {Scout, ScoutHistory} from "../../../models/scout.model";

@Component({
  selector: 'app-scout-history',
  imports: [],
  templateUrl: './scout-history.component.html',
  styleUrl: './scout-history.component.scss'
})
export class ScoutHistoryComponent {

  scout = input.required<Scout>();

  get scoutHistory(): ScoutHistory {
    return this.scout().scoutHistory;
  }
}
