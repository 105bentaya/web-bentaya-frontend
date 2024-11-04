import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {BookingService} from "../../service/booking.service";
import {Booking} from "../../model/booking.model";
import {FileUpload, FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {forkJoin} from "rxjs";
import {BookingDocument} from "../../model/booking-document.model";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {saveAs} from "file-saver";
import {documents, ScoutCentersInfo} from "../../constant/scout-center.constant";
import {Status} from "../../constant/status.constant";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {CurrencyPipe, DatePipe, NgTemplateOutlet} from "@angular/common";
import {DocumentStatusPipe} from '../../pipe/dcoument-status.pipe';
import {ScoutCenterStatusPipe} from '../../pipe/scout-center-status.pipe';
import {ScoutCenterPipe} from '../../pipe/scout-center.pipe';
import {RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import {BookingBetaAlertComponent} from "../booking-beta-alert/booking-beta-alert.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {
  GeneralIconButtonComponent
} from "../../../../shared/components/general-icon-button/general-icon-button.component";

@Component({
  selector: 'app-booking-follow-up',
  templateUrl: './booking-follow-up.component.html',
  styleUrls: ['./booking-follow-up.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    BookingBetaAlertComponent,
    TabViewModule,
    ScoutCenterPipe,
    DatePipe,
    FieldsetModule,
    DividerModule,
    CurrencyPipe,
    ScoutCenterStatusPipe,
    NgTemplateOutlet,
    FileUploadModule,
    DocumentStatusPipe,
    GeneralIconButtonComponent,
    BasicLoadingInfoComponent,
    RouterLink
  ]
})
export class BookingFollowUpComponent implements OnInit {

  private bookingService = inject(BookingService);
  private alertService = inject(AlertService);
  private dialogService = inject(DialogService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild('uploader')
  private uploader!: FileUpload;
  @ViewChild('incidentsUploader')
  private incidentUploader!: FileUpload;
  protected bookings!: Booking[];
  protected readonly documents = documents;
  protected readonly info = ScoutCentersInfo;
  protected files: BookingDocument[] = [];
  protected loading = false;
  private ref!: DynamicDialogRef;

  ngOnInit(): void {
    this.bookingService.getAllByCurrentUser().subscribe(data => {
      this.bookings = data;
      this.bookings.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      if (this.bookings.length > 0) this.getFiles(this.bookings[0].id);
    });
  }

  protected onTabChange(event: TabViewChangeEvent) {
    this.getFiles(this.bookings[event.index].id);
  }

  protected uploadFiles(event: FileUploadHandlerEvent, booking: Booking) {
    const fileUploadPetitions = event.files.map(file => this.bookingService.uploadBookingDocument(booking.id, file));

    forkJoin(fileUploadPetitions).subscribe({
      complete: () => {
        this.alertService.sendBasicSuccessMessage("Documentos subidos correctamente");
        this.getFiles(booking.id);
      }
    });
    this.bookingService.uploadBookingDocument(booking.id, event.files[0]);
  }

  private getFiles(id: number) {
    return this.bookingService.getBookingDocuments(id).subscribe(res => {
      this.files = res;
      this.uploader?.clear();
    });
  }

  protected downloadFile(file: BookingDocument) {
    this.loading = true;
    this.bookingService.getPDF(file.id).subscribe(pdf => {
      saveAs(pdf, file.fileName);
      this.loading = false;
    });
  }

  protected showFile(file: BookingDocument) {
    this.loading = true;
    const newTab = window.open("", "_blank");
    this.bookingService.getPDF(file.id).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      newTab?.location.assign(url);
      this.loading = false;
    });
  }

  protected deleteFile(file: BookingDocument) {
    this.confirmationService.confirm({
      message: "¿Desea borrar este documento? Esta acción no se puede revertir.",
      header: "Borrar documento",
      accept: () => {
        this.loading = true;
        this.bookingService.deleteDocument(file.id).subscribe({
          next: () => {
            this.alertService.sendBasicSuccessMessage("Documento eliminado");
            this.files.splice(this.files.indexOf(file), 1);
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    });
  }

  protected cancelReservation(booking: Booking) {
    this.ref = this.dialogService.open(BookingStatusUpdateComponent, {
      header: `Cancelar reserva`,
      styleClass: 'dialog-width small',
      data: {
        floatLabel: "Motivo de la cancelación",
        required: true,
        message: booking.status == "OCCUPIED" || booking.status == "FULLY_OCCUPIED" ?
          "Comente el motivo de la cancelación, indicando claramente si es por una causa de fuerza mayor o está" +
          "cancelando de forma voluntaria. Según esto valorarémos si le devolvemos el importe íntegro o solo una parte." :
          ""
      }
    });
    this.ref.onClose.subscribe(result => {
      if (result) this.updateBookingStatus("CANCELED", result.comment, booking);
    });
  }

  private updateBookingStatus(newStatus: Status, observations: string, booking: Booking) {
    this.loading = true;
    this.bookingService.updateStatusByUser({id: booking.id, newStatus, observations}).subscribe({
      next: result => {
        const index = this.bookings.findIndex(book => book.id === result.id);
        this.bookings[index].status = result.status;
        this.bookings[index].statusObservations = result.statusObservations;
        this.bookings[index].userConfirmedDocuments = result.userConfirmedDocuments;
        this.loading = false;
        this.alertService.sendBasicSuccessMessage("Reserva actualizada con éxito");
      }, error: () => this.loading = false
    });
  }

  protected confirmDocuments(booking: Booking) {
    this.confirmationService.confirm({
      header: "Confirmar",
      message: "Se informará a la gestión que revise sus documentos y no podrá editarlos. " +
        "En caso de error se le avisará para subsanarlos. ¿Desea continuar?",
      accept: () => this.updateBookingStatus("RESERVED", "", booking)
    });
  }

  protected finishReservation(booking: Booking) {
    let message = "";
    const hasUploadedDocument = this.incidentUploader.files.length >= 1;
    if (!hasUploadedDocument) {
      message += "No ha aportado el documento de registro de incidencias y estados.\n" +
        "No es obligatorio aportarlo, pero lo agradecemos si lo hace.\n";
    } else {
      message += `Ha aportado el siguiente documento: ${this.incidentUploader.files[0].name}.\n`;
    }
    if (new Date() <= new Date(booking.endDate)) {
      message += `La reserva aún no ha alcanzado su fecha de fin (${new DatePipe('es').transform(booking.endDate, "dd/MM/yyyy HH:mm")}).\n`;
    }
    message += "¿Desea continuar?";

    this.confirmationService.confirm({
      header: "Confirmar",
      message: message,
      accept: () => {
        if (hasUploadedDocument) {
          this.bookingService.uploadBookingDocument(booking.id, this.incidentUploader.files[0]).subscribe({
            next: () => this.updateBookingStatus("LEFT", "Documents uploaded", booking)
          });
        } else {
          this.updateBookingStatus("LEFT", "", booking);
        }
      }
    });
  }
}
