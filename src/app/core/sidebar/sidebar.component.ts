import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DividerModule} from "primeng/divider";
import {Button} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem} from "primeng/api";
import {Drawer} from "primeng/drawer";

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    DividerModule,
    Button,
    PanelMenuModule,
    Drawer
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
