import {Component, inject, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {Booking, bookingIsAlwaysExclusive} from "../../../model/booking.model";
import {documents} from "../../../constant/scout-center.constant";
import {Status} from "../../../constant/status.constant";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {DialogService} from "primeng/dynamicdialog";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";
import {BookingStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {BookingDocument, DocumentStatus} from "../../../model/booking-document.model";
import {saveAs} from "file-saver";
import {ConfirmationService} from "primeng/api";
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe, NgTemplateOutlet} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {DocumentStatusPipe} from "../../../pipe/document-status.pipe";
import {
  TableIconButtonComponent
} from "../../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {DialogModule} from "primeng/dialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {FileUtils} from "../../../../../shared/util/file.utils";
import {ScoutCenterService} from "../../../service/scout-center.service";
import {HourPipe} from "../../../../../shared/pipes/hour.pipe";
import {Tag} from "primeng/tag";
import {filter, Observable} from "rxjs";
import {BookingStatusService} from "../../../service/booking-status.service";
import {identity} from "lodash";

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
  providers: [DialogService, BookingStatusPipe, DynamicDialogService],
  imports: [
    DatePipe,
    CurrencyPipe,
    BookingStatusPipe,
    DividerModule,
    DocumentStatusPipe,
    TableIconButtonComponent,
    DialogModule,
    Button,
    HourPipe,
    Tag,
    NgTemplateOutlet
  ]
})
export class BookingDetailComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly bookingStatusService = inject(BookingStatusService);
  private readonly scoutCenterService = inject(ScoutCenterService);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly bookingIsAlwaysExclusive = bookingIsAlwaysExclusive;

  @Input() public booking!: Booking;
  protected loading = false;
  protected files: BookingDocument[] = [];
  protected readonly documents = documents;
  protected readonly Status = Status;
  protected showDocuments = false;
  protected dialogVisible = false;
  protected showMoreData = !!localStorage.getItem("bd_show_more_data");

  protected buttonsInfo = {
    "accept": {label: "Aceptar", icon: "pi pi-check", severity: "success", action: () => this.acceptBooking()},
    "confirm": {label: "Confirmar", icon: "pi pi-check", severity: "success", action: () => this.confirmBooking()},
    "warn": {label: "Notificar", icon: "pi pi-exclamation-triangle", severity: "warn", action: () => this.sendWarn()},
    "reject": {label: "Denegar", icon: "pi pi-times", severity: "danger", action: () => this.rejectBooking()},
  };

  ngOnInit(): void {
    this.getFiles(this.booking.id);
  }

  protected acceptBooking() {
    this.openDialog("Aceptar Reserva", {
      textAreaLabel: "Alguna observación que considere",
      showPrice: true,
      booking: this.booking
    }).onClose
      .pipe(filter(identity))
      .subscribe(({price, observations}) => this.updateBookingStatus(
        this.bookingStatusService.acceptBooking(this.booking.id, {price, observations})
      ));
  }

  protected confirmBooking() {
    //todo, mensaje cuando no están todos los documentos subidos;
    //informar que una vez confirmada la reserva ya no pueden subir documentos, así que mejor esperar
    this.openDialog("Confirmar Reserva", {
      textAreaLabel: "Alguna observación que considere",
      showExclusiveness: true,
      booking: this.booking
    }).onClose
      .pipe(filter(identity))
      .subscribe(({exclusive, observations}) => this.updateBookingStatus(
        this.bookingStatusService.confirmBooking(this.booking.id, {exclusive, observations})
      ));
  }

  protected sendWarn() {
    this.openDialog("Mandar notificación", {
      textAreaLabel: "Mensaje",
      textRequired: true,
      showSubject: true,
      booking: this.booking
    }).onClose
      .pipe(filter(identity))
      .subscribe(({subject, observations}) => this.updateBookingStatus(
        this.bookingStatusService.sendBookingWarning(this.booking.id, {subject, observations})
      ));
  }

  protected rejectBooking() {
    this.openDialog("Denegar Reserva", {
      textAreaLabel: "Motivo de denegación",
      textRequired: true,
      booking: this.booking
    }).onClose
      .pipe(filter(identity))
      .subscribe(({observations}) => this.updateBookingStatus(
        this.bookingStatusService.rejectBooking(this.booking.id, {observations})
      ));
  }

  private openDialog(header: string, data: any) {
    return this.dialogService.openDialog(BookingStatusUpdateComponent, header, "small", data);
  }

  private updateBookingStatus(request: Observable<Booking>) {
    this.loading = true;
    request.subscribe({
      next: result => {
        this.booking = result;
        this.loading = false;
        this.alertService.sendBasicSuccessMessage("Reserva actualizada con éxito");
      }, error: () => this.loading = false
    });
  }

  private getFiles(id: number) {
    return this.bookingService.getBookingDocuments(id).subscribe(res => {
      this.files = res;
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

  protected updateFile(document: BookingDocument, status: DocumentStatus) {
    this.loading = true;
    this.bookingService.updateDocument(document.id, status).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Documento actualizado");
        document.status = status;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  protected downloadAttendanceFile(centerId: number) {
    this.scoutCenterService.getAttendanceFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }

  protected queryShowMoreData() {
    this.showMoreData = !this.showMoreData;
    if (this.showMoreData) localStorage.setItem("bd_show_more_data", "1");
    else localStorage.removeItem("bd_show_more_data");
  }
}
