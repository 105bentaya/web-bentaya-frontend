import {Component, inject, OnInit} from '@angular/core';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DatePipe} from "@angular/common";
import {Scout} from "../../models/scout.model";
import {ScoutService} from "../../services/scout.service";
import {TabsModule} from "primeng/tabs";

@Component({
  selector: 'app-user-scout-info',
  imports: [
    BasicLoadingInfoComponent,
    DatePipe,
    TabsModule
  ],
  templateUrl: './user-scout-info.component.html',
  styleUrl: './user-scout-info.component.scss'
})
export class UserScoutInfoComponent implements OnInit {

  private readonly scoutService = inject(ScoutService);
  protected scouts!: Scout[];
  protected currentIndex = 0;

  ngOnInit(): void {
    this.scoutService.getAllByCurrentUser().subscribe({
      next: scouts => {
        this.scouts = scouts.sort((a, b) => b.birthday.toString().localeCompare(a.birthday.toString()));
      }
    });
  }
}
