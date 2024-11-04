import {Component, inject, OnInit} from '@angular/core';
import {ScouterListInfo} from "../../models/scouter-list-info.model";
import {ConfirmationService} from "../../services/confirmation.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AttendanceInfoComponent} from "../attendance-info/attendance-info.component";
import {EventInfoComponent} from "../../../calendar/components/event-info/event-info.component";
import {ScouterAttendanceFormComponent} from "../scouter-attendance-form/scouter-attendance-form.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService as ConfirmationMessageService, FilterService} from "primeng/api";
import {TagModule} from 'primeng/tag';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {ToggleButtonModule} from "primeng/togglebutton";
import {DateUtils} from "../../../../shared/util/date-utils";


@Component({
  selector: 'app-scouter-attendance-list',
  templateUrl: './scouter-attendance-list.component.html',
  styleUrls: ['./scouter-attendance-list.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    ToggleButtonModule,
    TableModule,
    TagModule,
    DatePipe
  ]
})
export class ScouterAttendanceListComponent implements OnInit {

  private confirmationService = inject(ConfirmationService);
  private confirmationMessageService = inject(ConfirmationMessageService);
  private dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private filterService = inject(FilterService);

  protected info!: ScouterListInfo[];
  protected loading: boolean = false;
  private queryParam = false;
  protected filterDates!: Date[];
  private ref!: DynamicDialogRef;
  private yesterday = DateUtils.plusDays(new Date(), -1);
  protected showClosedButton = false;

  ngOnInit(): void {
    this.getInfo(true);
  }

  private getInfo(query = false) {
    this.confirmationService.getAllBasicScouterInfo().subscribe({
      next: info => {
        this.info = this.generateList(info);
        this.showClosedButton = info.some(info => info.eventIsClosed && new Date(info.eventEndDate) <= this.yesterday);
        this.registerFilters();
        if (query) {
          this.checkQueryParams();
        }
      }
    });
  }

  private generateList(data: ScouterListInfo[]): ScouterListInfo[] {
    return data.sort((a, b) => this.attendanceSorter(a, b));
  }

  private attendanceSorter(a: ScouterListInfo, b: ScouterListInfo): number {
    return new Date(a.eventStartDate).toISOString().localeCompare(new Date(b.eventStartDate).toISOString());
  }

  protected openInfoDialog(eventId: number) {
    this.ref = this.dialogService.open(EventInfoComponent, {
      header: 'Actividad',
      styleClass: 'small dialog-width',
      data: eventId
    });
    //todo when editing an event refetch data
  }

  protected openEditDialog(eventInfo: ScouterListInfo) {
    this.ref = this.dialogService.open(ScouterAttendanceFormComponent, {
      header: `Editar Asistencia - ${eventInfo.eventTitle}`,
      styleClass: 'small dialog-width',
      data: {eventId: eventInfo.eventId, payment: eventInfo.eventHasPayment}
    });
    this.ref.onClose.subscribe(() => this.getInfo());
  }

  protected viewInfo(eventId: number, eventName: string, hasPayment: boolean) {
    this.ref = this.dialogService.open(AttendanceInfoComponent, {
      header: 'Asistencia - ' + eventName,
      styleClass: 'small dialog-width',
      data: {eventId: eventId, payment: hasPayment}
    });
    if (this.queryParam) {
      this.ref.onClose.subscribe(() => this.router.navigate([], {replaceUrl: true}));
      this.queryParam = false;
    }
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe(params => {
        if (params['list']) {
          const info = this.info.find(event => event.eventId == params['list']);
          if (info) {
            this.queryParam = true;
            this.viewInfo(info.eventId, info.eventTitle, info.eventHasPayment);
          } else {
            this.router.navigate([], {replaceUrl: true}).then();
          }
        }
      }
    );
  }

  protected downloadAttendanceExcel() {
    let message = "Para visualizar correctamente el excel, hay que deshabilitar la vista protegida una vez descargado.";
    if (this.info.some(eventInfo => eventInfo.notRespondedConfirmations > 0)) {
      message += "\nHay asistencias con educandas cuya asistencia está sin confirmar. " +
        "Estas educandas se marcarán en el excel como que no han asistido.";
    }
    message += "\n¿Desea continuar?";

    this.confirmationMessageService.confirm({
      header: "Asistencias sin confirmar",
      message,
      accept: () => this.confirmDownload()
    });
  }

  private confirmDownload() {
    this.loading = true;
    this.confirmationService.downloadCourseAttendanceExcelReport().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  private registerFilters() {
    this.filterService.register("past-attendance", (eventEndDate: Date, filterValue: boolean): boolean => {
      if (filterValue === undefined || filterValue === null) return true;
      if (eventEndDate === undefined || eventEndDate === null) return false;
      if (filterValue) return true;
      return new Date(eventEndDate) >= this.yesterday;
    });
    this.filterService.register("date-range", (objectId: number, hasBeenCleared: boolean): boolean => {
      if (hasBeenCleared || this.filterDates?.[0] == null || this.filterDates[1] == null) return true;
      const filterStartDate = new Date(this.filterDates[0]);
      const filterEndDate = DateUtils.dateAtLastSecondOfDay(this.filterDates[1]);
      return this.info.some(data => {
        const startDate = new Date(data.eventStartDate);
        const endDate = new Date(data.eventEndDate);
        return data.eventId === objectId && (startDate <= filterEndDate && endDate >= filterStartDate);
      });
    });
  }
}
