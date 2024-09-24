import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HomeBarComponent} from "./core/home-bar/home-bar.component";
import {FooterComponent} from "./core/footer/footer.component";
import {ToastModule} from "primeng/toast";
import {AlertService} from "./shared/services/alert-service.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {SettingsService} from "./core/settings/settings.service";
import localeEs from '@angular/common/locales/es'
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeBarComponent,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {

  private alertService = inject(AlertService);
  private messageService = inject(MessageService);
  private config = inject(PrimeNGConfig);
  private settingsService = inject(SettingsService);

  ngOnInit(): void {
    registerLocaleData(localeEs, 'es');

    this.alertService.getObservable().subscribe(message =>
      this.messageService.add({
        severity: message.severity,
        summary: message.title,
        detail: message.message,
        life: 7200
      })
    );

    this.setTranslation();
    this.checkForMaintenance();
  }

  private checkForMaintenance() {
    this.settingsService.getByName("maintenance").subscribe(
      result => {
        if (result.value !== "0") this.addMaintenanceMessage(new Date(result.value));
      }
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
      cancel: "Cancelar"
    });
  }
}
