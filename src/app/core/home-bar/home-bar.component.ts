import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AuthService} from '../auth/services/auth.service';
import {noop} from "rxjs";
import {ScoutInfoComponent} from "../../features/scouts/components/scout-info/scout-info.component";
import {NotificationService} from "../notification/notification.service";
import {ExcelService} from "../../shared/services/excel.service";
import {Scout} from "../../features/scouts/models/scout.model";
import {ScoutService} from "../../features/scouts/services/scout.service";
import {PaymentService} from "../../shared/services/payment.service";
import {GroupPipe} from '../../shared/pipes/group.pipe';
import {DialogModule} from 'primeng/dialog';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {ButtonDirective} from 'primeng/button';
import {LoginComponent} from "../../features/login/login.component";
import {ChangePasswordComponent} from "../../features/change-password/change-password.component";
import {socialMediaButtons} from "../../shared/constant";
import {NgOptimizedImage} from "@angular/common";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    MenubarModule,
    MenuModule,
    DialogModule,
    GroupPipe,
    NgOptimizedImage,
    BadgeModule
  ]
})
export class HomeBarComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private excelService = inject(ExcelService);
  private scoutService = inject(ScoutService);

  protected menu!: MenuItem[];
  protected menuItems: MenuItem[] = [];
  protected isLoggedIn = false;
  protected hasNotifications = false;
  private ref!: DynamicDialogRef;
  protected scouts!: Scout[];
  protected showDialog = false;
  protected socialMediaButtons = socialMediaButtons;

  ngOnInit(): void {
    this.watchIfIsLoggedIn();
    this.watchUserInfo();
    this.watchUserAttendanceNotifications();
    if (this.isLoggedIn) { //todo change to app.ts
      this.authService.loadUserInfo();
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  private buildMenu(): void {
    this.menu = [
      {icon: "pi pi-fw pi-home", label: "Inicio", routerLink: "/home"},
      {
        label: "Organización Scout", items: [
          {label: "Bentaya (SEB)", routerLink: "/asociacion/historia"},
          {
            label: "Canarias" + " (SEC)",
            command: () => window.open("https://www.facebook.com/scoutsdecanarias/", "_blank")
          },
          {label: "España (ASDE)", command: () => window.open("https://www.scout.es", "_blank")},
          {label: "España (FEE)", routerLink: "/fee"},
          {label: "Mundial (OMMS)", command: () => window.open("https://www.scout.org", "_blank")},
          {separator: true},
          {label: "Las Palmas (SELP)", routerLink: "/selp"},
        ]
      },
      {
        label: "Asociación Bentaya", items: [
          {label: "Quiénes somos", routerLink: "/asociacion/quienes-somos"},
          {label: "Qué hacemos", routerLink: "/asociacion/que-hacemos"},
          {label: "Misión, visión y valores", routerLink: "/asociacion/mision-vision-valores"},
          {label: "Historia", routerLink: "/asociacion/historia"},
          {label: "Método educativo", routerLink: "/educacion/metodo-educativo"},
          {label: "Reconocimientos", routerLink: "/asociacion/reconocimientos"},
        ]
      },
      {
        label: "Centros Scout", items: [
          {label: "Información", routerLink: "/centros-scout/informacion"},
          {label: "Hacer Reserva", routerLink: "/centros-scout/reserva"},
          {
            label: "Mis Reservas",
            routerLink: "/centros-scout/seguimiento",
            visible: !!this.authService.hasRequiredPermission(["ROLE_SCOUT_CENTER_REQUESTER"])
          },
        ]
      }
    ];
  }

  private watchUserInfo() {
    this.authService.loggedUser$.subscribe(() => this.buildSplitMenu());
  }

  private watchIfIsLoggedIn() {
    this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (!isLogged) {
        this.menuItems = [];
      }
      this.buildMenu();
    });
  }

  private watchUserAttendanceNotifications() {
    this.notificationService.userHasNotifications$.subscribe(hasNotifications => {
      this.hasNotifications = hasNotifications;
      const item = this.menuItems.find(item => item.id === "attendance");
      if (item) {
        if (hasNotifications) {
          item.label = 'Asistencia <span class="p-badge-danger p-badge p-component p-badge-no-gutter ng-star-inserted">!</span>';
        } else {
          item.label = "Asistencia";
        }
      }
    });
  }

  private viewScout() {
    this.ref = this.dialogService.open(ScoutInfoComponent, {
      header: 'Datos',
      styleClass: 'small dialog-width'
    });
  }

  private openImageAuthDialog() {
    this.scoutService.getAllWithoutImageAuthorization().subscribe({
      next: scouts => {
        this.scouts = scouts.sort((a, b) =>
          (a.groupId - b.groupId) || (a.surname.localeCompare(b.surname))
        );
        this.showDialog = true;
      }
    });
  }

  private buildSplitMenu() {
    this.buildMenu();
    this.menuItems = [];

    if (this.userHasBasicRoles()) {
      this.buildBasicItems();
      this.menuItems.push({separator: true});
    }

    if (this.authService.hasRequiredPermission(["ROLE_USER"])) {
      this.buildUserItems();
      this.menuItems.push({separator: true});
      this.notificationService.checkIfHasNotifications();
    }
    if (this.authService.hasRequiredPermission(["ROLE_SCOUTER"])) {
      this.buildScouterItems();
      this.menuItems.push({separator: true});
    }
    if (this.authService.hasRequiredPermission(["ROLE_SCOUT_CENTER_REQUESTER"])) {
      this.buildScoutCenterRequesterItems();
      this.menuItems.push({separator: true});

    }
    if (this.authService.hasRequiredPermission(["ROLE_SCOUT_CENTER_MANAGER"])) {
      this.buildScoutCenterManagerItems();
      this.menuItems.push({separator: true});
    }
    if (this.authService.hasRequiredPermission(["ROLE_GROUP_SCOUTER"])) {
      this.buildGroupScouterItems();
      this.menuItems.push({separator: true});
    }
    if (this.authService.hasRequiredPermission(["ROLE_TRANSACTION"])) {
      this.buildTransactionItems();
      this.menuItems.push({separator: true});
    }
    if (this.authService.hasRequiredPermission(["ROLE_FORM"])) {
      this.buildFormItems();
      this.menuItems.push({separator: true});
    }
    if (this.authService.hasRequiredPermission(["ROLE_ADMIN"])) {
      this.buildAdministrationItems();
      this.menuItems.push({separator: true});
    }
    this.menuItems.push(
      {
        label: "Cambiar Contraseña",
        icon: "pi pi-pencil",
        command: () => this.changePassword()
      },
      {
        label: "Cerrar Sesión",
        icon: "pi pi-sign-out",
        command: () => this.logOut()
      }
    );
  }

  private userHasBasicRoles(): boolean {
    return this.authService.hasRequiredPermission(["ROLE_USER"]) ||
      this.authService.hasRequiredPermission(["ROLE_SCOUTER"]) ||
      this.authService.hasRequiredPermission(["ROLE_GROUP_SCOUTER"]);
  }

  private buildBasicItems() {
    this.menuItems.push(
      {
        label: "Calendario",
        icon: "pi pi-calendar",
        command: () => this.router.navigate(["/calendar"])
      },
    );
  }

  private buildUserItems() {
    this.menuItems.push(
      {
        label: "Datos",
        icon: "pi pi-id-card",
        command: () => this.viewScout()
      },
      {
        label: 'Asistencia',
        id: "attendance",
        escape: false,
        icon: "pi pi-check-circle",
        command: () => this.router.navigate(["/asistencias"])
      }
    );
  }

  private buildScouterItems() {
    this.menuItems.push(
      {
        label: "Sin Autorización",
        icon: "pi pi-images",
        command: () => this.openImageAuthDialog()
      },
      {
        label: "Educandas",
        icon: "pi pi-users",
        command: () => this.router.navigate(["/unidad/educandos"])
      },
      {
        label: "Listas de Asistencia",
        icon: "pi pi-list",
        command: () => this.router.navigate(["/unidad/asistencia"])
      },
      {
        label: "Preinscripciones",
        icon: "pi pi-folder",
        command: () => this.router.navigate(["/unidad/preinscripciones"])
      },
    );
  }

  private buildGroupScouterItems() {
    this.menuItems.push(
      {
        label: "Sin Autorización",
        icon: "pi pi-images",
        command: () => this.openImageAuthDialog()
      },
      {
        label: "Educandas",
        icon: "pi pi-users",
        command: () => this.router.navigate(["/unidad/educandos"])
      }
    );
  }

  private buildFormItems() {
    this.menuItems.push(
      {
        label: "Preinscripciones",
        icon: "pi pi-folder",
        command: () => this.router.navigate(["/preinscriptions"])
      },
      {
        label: "Voluntariado",
        icon: "pi pi-heart",
        command: () => this.router.navigate(["/scouter-preinscriptions"])
      },
      {
        label: "Sección Sénior",
        icon: "fa-solid fa-hat-cowboy",
        command: () => this.router.navigate(["/seccion-senior/lista"])
      });
  }

  private buildAdministrationItems() {
    this.menuItems.push(
      {
        label: "Usuarios",
        icon: "pi pi-database",
        command: () => this.router.navigate(["/users"])
      },
      {
        label: "Educandas",
        icon: "pi pi-server",
        command: () => this.router.navigate(["/educandos"])
      },
      {
        label: "Ajustes",
        icon: "pi pi-cog",
        command: () => this.router.navigate(["/settings"])
      });
  }

  private buildTransactionItems() {
    this.menuItems.push(
      {
        label: "Transacciones",
        icon: "pi pi-wallet",
        command: () => this.downloadTransactions()
      }, {
        label: "Donaciones",
        icon: "fa-solid fa-piggy-bank",
        routerLink: '/donaciones/lista'
      }
    );
  }

  private buildScoutCenterRequesterItems() {
    this.menuItems.push({
      label: "Mis Reservas",
      icon: "pi pi-compass",
      command: () => this.router.navigate(["/centros-scout/seguimiento"])
    });

  }

  private buildScoutCenterManagerItems() {
    this.menuItems.push({
      label: "Gestión Centros Scout",
      icon: "pi pi-wrench",
      command: () => this.router.navigate(["/centros-scout/gestion"])
    });
  }

  private logOut() {
    this.authService.logout();
    this.router.navigate(["/home"]).then(noop);
  }

  protected logIn() {
    this.ref = this.dialogService.open(LoginComponent, {
      header: 'Inicio de Sesión',
      styleClass: 'login dialog-width'
    });
  }

  private changePassword() {
    this.ref = this.dialogService.open(ChangePasswordComponent, {
      header: 'Cambiar Contraseña'
    });
  }

  private downloadTransactions() {
    this.paymentService.getAll().subscribe({
      next: data => {
        this.excelService.exportAsExcel(data.map(payment => ({...payment, amount: payment.amount / 100})),
          ["ID", "Número de Pedido", "Estado", "Tipo de Pago", "Fecha de Modificación", "Cantidad"],
          "transacciones");
      }
    });
  }
}
