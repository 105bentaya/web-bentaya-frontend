import {Component, inject, OnInit} from '@angular/core';
import {TabsModule} from "primeng/tabs";
import {UserScout} from "../../../users/models/user.model";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {UserRole} from "../../../users/models/role.model";

@Component({
  selector: 'app-user-scout-info',
  imports: [
    TabsModule,
    RouterOutlet
  ],
  templateUrl: './user-scout-info.component.html',
  styleUrl: './user-scout-info.component.scss'
})
export class UserScoutInfoComponent implements OnInit {

  private readonly userData = inject(LoggedUserDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected scouts!: UserScout[];
  protected currentId!: number;
  protected showLegalInformation = !this.userData.hasRequiredPermission(UserRole.SCOUTER);

  ngOnInit(): void {
    const scouts = this.userData.getScouts();
    const scouter = this.userData.getScouter();
    if (scouter) {
      scouter.name = "Tus Datos";
      scouts.unshift(scouter);
    }

    const paramId = this.route.snapshot.firstChild?.params["id"];
    if (paramId && scouts.some(scout => scout.id === +paramId)) {
      this.currentId = +paramId;
    } else {
      this.currentId = scouts[0].id;
    }

    this.scouts = scouts;
    this.onTabChange(this.currentId);
  }

  onTabChange(newId: string | number) {
    this.router.navigate(["datos", newId],  {queryParamsHandling: "preserve", replaceUrl: true});
  }
}
