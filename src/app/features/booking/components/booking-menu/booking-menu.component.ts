import {Component} from '@angular/core';
import {palmital} from "../../constant/palmital.information";
import {tejeda} from "../../constant/tejeda.information";
import {terreno} from "../../constant/terreno.information";
import {refugioTerreno} from "../../constant/refugio-terreno.information";
import {BookingInformationComponent} from '../booking-information/booking-information.component';
import {FlexCardComponent} from '../../../../shared/components/flex-card/flex-card.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-booking-menu',
  templateUrl: './booking-menu.component.html',
  styleUrls: ['./booking-menu.component.scss'],
  imports: [
    RouterLink,
    FlexCardComponent,
    BookingInformationComponent
  ]
})
export class BookingMenuComponent {

  protected selectedOption = 0;
  protected colors = ["#ED5565", "#f89853", "#2ECC71", "#AC92EC"];
  protected scoutCenters = [
    {
      mainText: "Aula de la Naturaleza El Palmital",
      subText: "El Palmital, Guía",
      backgroundImageUrl: "assets/centros-scout/palmital/menu.png",
      iconClass: "fa-solid fa-bed",
      scoutCenter: palmital
    },
    {
      mainText: "Campamento Bentaya",
      subText: "El Picacho, Arucas",
      backgroundImageUrl: "assets/centros-scout/terreno/menu.jpg",
      iconClass: "fa-solid fa-tree",
      scoutCenter: terreno
    },
    {
      mainText: "Refugio Luis Martín",
      subText: "El Picacho, Arucas",
      backgroundImageUrl: "assets/centros-scout/refugio/menu.jpg",
      iconClass: "fa-solid fa-tent",
      scoutCenter: refugioTerreno
    },
    {
      mainText: "Refugio Bentayga",
      subText: "La Higuerilla, Tejeda",
      backgroundImageUrl: "assets/centros-scout/tejeda/menu.jpg",
      iconClass: "fa-solid fa-house-chimney",
      scoutCenter: tejeda
    }
  ];
}
