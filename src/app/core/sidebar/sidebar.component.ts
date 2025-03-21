import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, NavigationSkipped, Router, RouterLink} from "@angular/router";
import {DividerModule} from "primeng/divider";
import {Button} from "primeng/button";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem} from "primeng/api";
import {Drawer} from "primeng/drawer";
import {filter} from "rxjs";
import {NgClass} from "@angular/common";
import {StringUtils} from "../../shared/util/string.utils";
import {AuthService} from "../auth/services/auth.service";
import {UserRoutesService} from "../auth/services/user-routes.service";

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

  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly userRoutes = inject(UserRoutesService);

  protected currentUrl = "";
  protected sidebarVisible: boolean = false;

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationSkipped)
    ).subscribe((event) => {
      this.sidebarVisible = false;
      this.currentUrl = StringUtils.getUrlPath(event instanceof NavigationEnd ? event.urlAfterRedirects : event.url);
      this.checkForExpansion(this.items);
      this.checkForSelection(this.items);
    });
    this.currentUrl = StringUtils.getUrlPath(this.router.url);
    this.checkForExpansion(this.items);
    this.checkForSelection(this.items);

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      const scoutCentersItems = this.items.find(item => item.id === 'scout-centers')!.items!;
      if (isLoggedIn) {
        scoutCentersItems.push(
          {
            id: 'reservations',
            label: "Mis Reservas",
            routerLink: "/centros-scout/seguimiento"
          });
      } else {
        const reservationsItems = scoutCentersItems.findIndex(item => item.id === 'reservations');
        if (reservationsItems >= 0) scoutCentersItems.splice(reservationsItems, 1);
      }
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
              fragment: 'quienes-somos'
            },
            {
              label: "Qué hacemos",
              routerLink: '/asociacion/grupo',
              fragment: "que-hacemos"
            },
            {
              label: "Método Educativo",
              routerLink: '/asociacion/grupo',
              fragment: "escultismo"
            }
          ]
        },
        {
          label: "Secciones Educativas",
          routerLink: '/asociacion/secciones',
        },
        {
          label: "Historia",
          routerLink: '/asociacion/historia',
        },
        {
          label: "Misión Visión y Valores",
          routerLink: '/asociacion/mision-vision-valores',
        },
        {
          label: "Reconocimientos",
          routerLink: '/asociacion/reconocimientos',
        }
      ]
    },
    {
      id: 'scout-centers',
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
