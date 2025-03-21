import {Component, inject, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {Booking} from "../../../model/booking.model";
import {documents} from "../../../constant/scout-center.constant";
import {Status} from "../../../constant/status.constant";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";
import {ScoutCenterStatusPipe} from "../../../pipe/scout-center-status.pipe";
import {BookingDocument, DocumentStatus} from "../../../model/booking-document.model";
import {saveAs} from "file-saver";
import {ConfirmationService} from "primeng/api";
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {DocumentStatusPipe} from "../../../pipe/document-status.pipe";
import {
  TableIconButtonComponent
} from "../../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {DialogModule} from "primeng/dialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {FileUtils} from "../../../../../shared/util/file.utils";
import {ScoutCenterService} from "../../../service/scout-center.service";

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
  providers: [DialogService, ScoutCenterStatusPipe, DynamicDialogService],
  imports: [
    DatePipe,
    CurrencyPipe,
    ScoutCenterStatusPipe,
    DividerModule,
    DocumentStatusPipe,
    TableIconButtonComponent,
    DialogModule,
    Button
  ]
})
export class BookingDetailComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly scoutCenterService = inject(ScoutCenterService);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly pipe = inject(ScoutCenterStatusPipe);
  private readonly confirmationService = inject(ConfirmationService);

  @Input() public booking!: Booking;
  protected loading = false;
  private ref!: DynamicDialogRef;
  protected files: BookingDocument[] = [];
  protected readonly documents = documents;
  protected showDocuments = false;
  protected dialogVisible = false;

  ngOnInit(): void {
    this.getFiles(this.booking.id);
  }

  protected openStatusForm(newStatus: Status, data?: {
    required?: boolean,
    showPrice?: boolean,
    message?: string
  }, floatLabel = "Alguna observación que considere") {
    const header = this.booking.status === "RESERVED" && newStatus === "RESERVED" ?
      'Rechazar documentos para subsanar' :
      `Actualizar a '${this.pipe.transform(newStatus)}'`;
    this.ref = this.dialogService.openDialog(BookingStatusUpdateComponent, header, "small", {
      floatLabel,
      required: data?.required,
      message: data?.message,
      showPrice: data?.showPrice
    });
    this.ref.onClose.subscribe(result => {
      if (result) this.updateBookingStatus(newStatus, result.comment, result.price);
    });
  }

  private updateBookingStatus(newStatus: Status, observations: string, price?: number) {
    this.loading = true;
    this.bookingService.updateStatus({id: this.booking.id, newStatus, observations, price}).subscribe({
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

  downloadAttendanceFile(centerId: number) {
    this.scoutCenterService.getAttendanceFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }
}
