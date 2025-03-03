import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {FooterComponent} from "./core/footer/footer.component";
import {ToastModule} from "primeng/toast";
import {AlertService} from "./shared/services/alert-service.service";
import {MessageService} from "primeng/api";
import {SettingsService} from "./features/settings/settings.service";
import localeEs from '@angular/common/locales/es'
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AuthService} from "./core/auth/services/auth.service";
import {filter, noop} from "rxjs";
import {PrimeNG} from "primeng/config";
import Lara from '@primeng/themes/lara';
import {definePreset} from "@primeng/themes";
import {HomeBarComponent} from "./core/home-bar/home-bar.component";
import {UserMenuComponent} from "./core/user-menu/user-menu.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule,
    HomeBarComponent,
    UserMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {

  private readonly alertService = inject(AlertService);
  private readonly messageService = inject(MessageService);
  private readonly config = inject(PrimeNG);
  private readonly settingsService = inject(SettingsService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected routeIsProtected: boolean | undefined;
  protected routeIsLogin: boolean | undefined;

  ngOnInit(): void {
    this.configureApp();
    this.activateMessagingService();
    this.checkForMaintenance();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.checkIfRouteIsProtected());
  }

  private checkIfRouteIsProtected() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const routeConfig = route.routeConfig;
    this.routeIsProtected = !!routeConfig?.canActivate;
    this.routeIsLogin = this.routeIsNotAuthGuard(routeConfig?.path);
  }

  private routeIsNotAuthGuard(path?: string): boolean {
    return !!(path === "login" || path?.startsWith("restablecer-clave"));
  }

  private configureApp() {
    registerLocaleData(localeEs, 'es');
    this.setTranslation();

    const stylePreset = definePreset(Lara, {
      semantic: {
        primary: {
          50: '{blue.50}',
          100: '{blue.100}',
          200: '{blue.200}',
          300: '{blue.300}',
          400: '{blue.400}',
          500: '{blue.500}',
          600: '{blue.600}',
          700: '{blue.700}',
          800: '{blue.800}',
          900: '{blue.900}',
          950: '{blue.950}'
        }
      }
    });


    this.config.theme.set({
      preset: stylePreset,
      options: {
        darkModeSelector: false,
        cssLayer: {
          name: 'primeng',
          order: 'bootstrap, primeng'
        }
      }
    });
  }

  private activateMessagingService() {
    this.alertService.getObservable().subscribe(message =>
      this.messageService.add({
        severity: message!.severity,
        summary: message!.title,
        detail: message!.message,
        life: 7200
      })
    );
  }

  private checkForMaintenance() {
    this.settingsService.getByName("maintenance").subscribe(
      result => result.value !== "0" ? this.addMaintenanceMessage(new Date(result.value)) : noop()
    );
  }

  private addMaintenanceMessage(date: Date) {
    const pipe = new DatePipe("es");
    setTimeout(() => this.messageService.add({
      severity: "warn",
      summary: "Aviso de Mantenimiento",
      detail: `Hay un mantenimiento programado para las ${pipe.transform(date, "HH:mm 'del' d 'de' MMMM")} durante el cual la web no estará disponible durante unos minutos. No inicie ninguna operación a partir de esta hora, ya que podría no funcionar correctamente`,
      life: 1000000,
      key: "maintenance"
    }), 0);
  }

  private setTranslation() {
    this.config.setTranslation({
      chooseDate: "Seleccionar Día",
      chooseMonth: "Seleccionar Mes",
      chooseYear: "Seleccionar Año",
      emptySelectionMessage: "Ninguna selección",
      nextDecade: "Siguiente Década",
      nextHour: "Siguiente Hora",
      nextMinute: "Siguiente Minuto",
      nextMonth: "Siguiente Mes",
      nextSecond: "Siguiente Segundo",
      nextYear: "Siguiente Año",
      pending: "Pendiente",
      prevDecade: "Década Anterior",
      prevHour: "Hora Anterior",
      prevMinute: "Minuto Anterior",
      prevMonth: "Mes Anterior",
      prevSecond: "Segundo Anterior",
      prevYear: "Año Anterior",
      searchMessage: "{0} resultados disponibles",
      selectionMessage: "{0} selecciones",
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      accept: "Sí",
      firstDayOfWeek: 1,
      dateFormat: "dd/mm/yy",
      emptySearchMessage: "No hay resultados",
      emptyMessage: "No hay resultados",
      cancel: "Cancelar",
      today: "Hoy",
      clear: "Borrar"
    });
  }
}
