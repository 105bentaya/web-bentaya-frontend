import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, NavigationSkipped, Router, RouterLink} from "@angular/router";
import {DividerModule} from "primeng/divider";
import {Button} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem} from "primeng/api";
import {Drawer} from "primeng/drawer";
import {filter} from "rxjs";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    DividerModule,
    Button,
    PanelMenuModule,
    Drawer,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationSkipped)
    ).subscribe((event) => {
      this.sidebarVisible = false;
      const url = event instanceof NavigationEnd ? event.urlAfterRedirects : event.url;
      this.currentUrl = url.split('#')[0];
      this.checkForExpansion(this.items);
      this.checkForSelection(this.items);
    });
  }

  private checkForExpansion(items: MenuItem[]) {
    items.forEach(item => {
      const itemUrl = item['expandWhenUrl'];
      item.expanded = this.currentUrl.startsWith(itemUrl);
      if (item.items) this.checkForExpansion(item.items);
    });
  }

  private checkForSelection(items: MenuItem[]) {
    items.forEach(item => {
      item.styleClass = item.fragment === undefined && (item.routerLink === this.currentUrl || item['select'] === this.currentUrl) ? "bg-select" : "";
      if (item.items) this.checkForSelection(item.items);
    });
  }

  currentUrl = "";
  sidebarVisible: boolean = false;
  protected readonly router = inject(Router);

  items: MenuItem[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      routerLink: '/inicio'
    },
    {
      label: "Organización Scout",
      items: [
        {
          label: "Scouts de Canarias (SEC)",
          url: "https://www.facebook.com/scoutsdecanarias/",
          target: "_blank"
        },
        {
          label: "Scouts de España (ASDE)",
          url: "https://scout.es/",
          target: "_blank"
        },
        {
          label: "Scouts Mundial (OMMS)",
          url: "https://www.scout.org",
          target: "_blank"
        }
      ]
    },
    {
      label: "Asociación Bentaya",
      expandWhenUrl: '/asociacion',
      items: [
        {
          label: "Sobre nosotros",
          select: '/asociacion/grupo',
          expandWhenUrl: '/asociacion/grupo',
          items: [
            {
              label: "Quiénes somos",
              routerLink: '/asociacion/grupo',
              fragment: ''
            },
            {
              label: "Qué hacemos",
              routerLink: '/asociacion/grupo',
              fragment: "que-hacemos"
            },
            {
              label: "Misión, Visión y Valores",
              routerLink: '/asociacion/grupo',
              fragment: "mvv"
            },
            {
              label: "Método Educativo",
              routerLink: '/asociacion/grupo',
              fragment: "escultismo"
            }
          ]
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
      expandWhenUrl: '/centros-scout',
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
  ];

  protected expand() {
    this.checkForExpansion(this.items);
    this.checkForSelection(this.items);
    this.sidebarVisible = true;
  }
}
