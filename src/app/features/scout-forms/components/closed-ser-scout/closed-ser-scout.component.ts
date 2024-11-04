import {Component, Input} from '@angular/core';
import {maintenanceEmail} from "../../../../shared/constant";

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
  protected readonly maintenanceEmail = maintenanceEmail;
}
