import {Component, inject, OnInit} from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {Router, RouterLink} from "@angular/router";
import {DividerModule} from "primeng/divider";
import {Button} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import _default from "chart.js/dist/plugins/plugin.legend";
import onClick = _default.defaults.onClick;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    RouterLink,
    DividerModule,
    Button,
    PanelMenuModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent{
  sidebarVisible: boolean = false;
  private readonly router = inject(Router);

  items: MenuItem[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      command:() => this.router.navigate(['/home'])
    },
    {
      label: "Organización Scout",
      items: [
        {
          label: "Scouts de Canarias (SEC)",
          command:()=> open("https://www.facebook.com/scoutsdecanarias/", "_blank")
        },
        {
          label: "Scouts de España (ASDE)",
          command:()=> open("https://scout.es/", "_blank")
        },
        {
          label: "Scouts Mundial (OMMS)",
          command:()=> open("https://www.scout.org/", "_blank")
        }
      ]
    },
    {
      label: "Asociación Bentaya",
      items: [
        {
          label: "Quiénes somos",
          command:() => this.router.navigate(['/asociacion'], {fragment: 'quienes-somos'})
        },
        {
          label: "Qué hacemos",
          command:() => this.router.navigate(['/asociacion'], {fragment: 'que-hacemos'})
        },
        {
          label: "Misión, Visión y Valores",
          command:() => this.router.navigate(['/asociacion'], {fragment: 'mvv'})
        },
        {
          label: "Método Educativo",
          command:() => this.router.navigate(['/asociacion'], {fragment: 'escultismo'})
        },
        {
          label: "Unidades",
          items: [
            {
              label: "Colonia"
            },
            {
              label: "Manadas"
            },
            {
              label: "Tropas"
            },
            {
              label: "Unidad"
            },
            {
              label: "Clan"
            },
            {
              label: "Kraal"
            }
          ]
        }
      ]
    },
    {
      label: "Centros Scout",
      items: [
        {
          label: "Información",
          routerLink: "/centros-scout/informacion"
        },
        {
          label: "Hacer Reserva",
          routerLink: "/centros-scout/reserva"
        }
      ]
    }
  ]
}
