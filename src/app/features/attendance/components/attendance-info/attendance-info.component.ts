import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ConfirmationService} from "../../services/confirmation.service";
import {EventAttendanceInfo} from "../../models/event-attendance-info.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {PanelModule} from 'primeng/panel';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";

@Component({
  selector: 'app-attendance-info',
  templateUrl: './attendance-info.component.html',
  styleUrls: ['./attendance-info.component.scss'],
  standalone: true,
  imports: [
    PanelModule,
    BasicLoadingInfoComponent
  ]
})
export class AttendanceInfoComponent implements OnInit {

  private config = inject(DynamicDialogConfig);
  private confirmationService = inject(ConfirmationService);
  private alertService = inject(AlertService);

  protected info!: EventAttendanceInfo[];
  protected assistants!: EventAttendanceInfo[];
  protected assistantList!: string[];
  protected noAssistantList!: string[];
  protected noConfirmedList!: string[];
  protected medicalDataList!: string[];
  protected observationsList!: string[];
  protected collapsedArray = [true, false, true, true, false];
  protected eventHasPayment = false;
  protected paymentText = "";
  protected notPayedAssistants = 0;
  private totalPayed = 0;

  ngOnInit(): void {
    this.restoreToggleStatus();
    if (this.config.data.eventId) {
      this.eventHasPayment = this.config.data.payment;
      this.confirmationService.getEventAttendanceInfo(this.config.data.eventId).subscribe({
        next: data => {
          this.info = data.sort((a, b) => a.surname.localeCompare(b.surname));
          this.generateInfoLists();
        }
      });
    } else {
      this.alertService.sendBasicErrorMessage("Error al cargar la asistencia, no se han cargado los datos necesarios");
    }
  }

  restoreToggleStatus() {
    for (let i = 0; i < 5; i++) {
      const res = localStorage.getItem(`c${i}`);
      this.collapsedArray[i] = res ? res === "true" : true;
    }
  }

  saveToggleStatus(collapsedIndex: number) {
    localStorage.setItem(`c${collapsedIndex}`, JSON.stringify(!this.collapsedArray[collapsedIndex]));
  }

  private generateInfoLists() {
    this.assistants = this.info.filter(info => info.attending);
    this.assistantList = this.createAssistantList();
    this.noAssistantList = this.createNoAssistantList();
    this.noConfirmedList = this.createNoConfirmedList();
    this.medicalDataList = this.assistants.filter(info => info.medicalData).map(info => `${this.getFullName(info)}: ${info.medicalData}`);
    this.observationsList = this.assistants.filter(info => info.text).map(info => `${this.getFullName(info)}: ${info.text}`);
    if (this.eventHasPayment) {
      this.notPayedAssistants = this.assistants.filter(info => !info.payed).length;
      this.totalPayed = this.info.filter(info => info.payed).length;
      this.createPaymentText();
    }
  }

  private sortListByPayment(list: EventAttendanceInfo[], payedFirst = false) {
    if (payedFirst) return list.sort((a, b) => this.eventAttendanceInfoComparator(b, a));
    return list.sort((a, b) => this.eventAttendanceInfoComparator(a, b));
  }

  private createAssistantList() {
    if (!this.eventHasPayment) {
      return this.assistants.map(info => this.getFullName(info));
    }
    return this.sortListByPayment(this.assistants)
      .map(info => this.getFullName(info) + (info.payed ? " (Ha pagado)" : "  <b class='text-danger'>(No ha pagado)</b>"));
  }

  private createNoAssistantList() {
    const noAttendingList = this.info.filter(info => info.attending === false);

    if (!this.eventHasPayment) {
      return noAttendingList.map(info => this.getFullName(info) + (info.text ? ": " + info.text : ""));
    }

    return this.sortListByPayment(noAttendingList, true)
      .map(info => this.getFullName(info) + (info.payed ? " (Ha pagado)" : "") + (info.text ? ": " + info.text : ""));
  }

  private createNoConfirmedList() {
    const noAttendingList = this.info.filter(info => info.attending === null);

    if (!this.eventHasPayment) {
      return noAttendingList.map(info => `${info.name} ${info.surname}`);
    }

    return this.sortListByPayment(noAttendingList, true)
      .map(info => this.getFullName(info) + (info.payed ? " (Ha pagado)" : ""));
  }

  private createPaymentText() {
    this.paymentText =
      `${this.totalPayed == 1 ? "Ha" : "Han"}
      pagado ${this.totalPayed}
      ${this.totalPayed == 1 ? "persona" : "personas"}`;
    if (this.totalPayed > (this.assistants.length - this.notPayedAssistants)) {
      const noAssistantsPayed = this.info.filter(info => info.attending == false && info.payed).length;
      const noConfirmedPayed = this.info.filter(info => info.attending == null && info.payed).length;
      if (noAssistantsPayed && noConfirmedPayed) {
        this.paymentText += ` (de las cuales ${noAssistantsPayed} no asiste${noAssistantsPayed > 1 ? 'n' : ''}
        y ${noConfirmedPayed} no ha${noConfirmedPayed > 1 ? 'n' : ''} confirmado).`;
      } else if (noAssistantsPayed) {
        this.paymentText += ` (de las cuales ${noAssistantsPayed} no asiste${noAssistantsPayed > 1 ? 'n' : ''}).`;
      } else {
        this.paymentText += ` (de las cuales ${noConfirmedPayed} no ha${noConfirmedPayed > 1 ? 'n' : ''} confirmado).`;
      }
    } else {
      this.paymentText += ".";
    }
  }

  private getFullName(info: EventAttendanceInfo) {
    return `${info.name} ${info.surname}`;
  }

  private eventAttendanceInfoComparator(a: EventAttendanceInfo, b: EventAttendanceInfo) {
    return Number(a.payed) - Number(b.payed);
  }
}
