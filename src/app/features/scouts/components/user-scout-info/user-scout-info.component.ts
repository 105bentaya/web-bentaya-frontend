import {Component, inject, OnInit} from '@angular/core';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {ScoutService} from "../../services/scout.service";
import {TabsModule} from "primeng/tabs";
import {UserScout} from "../../../users/models/user.model";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";

@Component({
  selector: 'app-user-scout-info',
  imports: [
    BasicLoadingInfoComponent,
    TabsModule
  ],
  templateUrl: './user-scout-info.component.html',
  styleUrl: './user-scout-info.component.scss'
})
export class UserScoutInfoComponent implements OnInit {

  private readonly scoutService = inject(ScoutService);
  private readonly userData = inject(LoggedUserDataService);
  protected scouts!: UserScout[];
  protected currentIndex = 0;

  ngOnInit(): void {
    const scouts = this.userData.getScouts();
    const scouter = this.userData.getScouter();
    if (scouter) {
      scouter.name = "Tus Datos";
      scouts.unshift(scouter);
    }
    this.scouts = scouts;
  }
}
