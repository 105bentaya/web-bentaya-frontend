import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-transparencia',
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss'],
  imports: [RouterLink, NgClass]
})
export class TransparenciaComponent {
  items = [
    {
      label: "Económico Financiero",
      image: "insignia-economia.png",
      routerLink: "gestion-economica"
    },
    {
      label: "Voluntariado",
      image: "insignia-voluntariado.png"
    },
    {
      label: "Plan de Actividades",
      image: "insignia-actividades.png"
    },
    {
      label: "Subvenciones",
      image: "insignia-subvenciones.png"
    },
    {
      label: "Órganos de Representación",
      image: "insignia-representacion.png",
      routerLink: 'cargos'
    }
  ];
}
