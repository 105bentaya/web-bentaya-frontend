import {Component, inject, OnInit} from '@angular/core';
import {BookingInformationComponent} from '../booking-information/booking-information.component';
import {FlexCardComponent} from '../../../../shared/components/flex-card/flex-card.component';
import {RouterLink} from '@angular/router';
import {ScoutCenterService} from "../../service/scout-center.service";
import {ScoutCenter, ScoutCenterInformation} from "../../model/scout-center.model";

@Component({
  selector: 'app-booking-home',
  templateUrl: './booking-home.component.html',
  styleUrls: ['./booking-home.component.scss'],
  imports: [
    RouterLink,
    FlexCardComponent,
    BookingInformationComponent
  ]
})
export class BookingHomeComponent implements OnInit {

  private readonly scoutCenterService = inject(ScoutCenterService);
  protected selectedOption = 0;
  protected colors = ["#ED5565", "#f89853", "#2ECC71", "#AC92EC"];
  protected scoutCenters!: ScoutCenterInformation[];

  protected extras: { [key: number]: any } = { //todo
    4: {icon: "fa-solid fa-bed", image: "assets/centros-scout/palmital/menu.png"},
    1: {icon: "fa-solid fa-tree", image: "assets/centros-scout/terreno/menu.jpg"},
    2: {icon: "fa-solid fa-tent", image: "assets/centros-scout/tejeda/menu.jpg"},
    3: {icon: "fa-solid fa-house-chimney", image: "assets/centros-scout/refugio/menu.jpg"}
  };

  ngOnInit() {
    this.scoutCenterService.getAllInformation().subscribe(result => this.scoutCenters = result);
  }
}
