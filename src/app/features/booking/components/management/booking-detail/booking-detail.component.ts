import {Component, inject, Input, OnInit} from '@angular/core';
import {BookingService} from "../../../service/booking.service";
import {Booking, bookingIsAlwaysExclusive} from "../../../model/booking.model";
import {Status} from "../../../constant/status.constant";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {DialogService} from "primeng/dynamicdialog";
import {BookingStatusUpdateComponent} from "../booking-status-update/booking-status-update.component";
import {BookingStatusPipe} from "../../../../scout-center/scout-center-status.pipe";
import {BookingDocument, BookingDocumentType} from "../../../model/booking-document.model";
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe, NgTemplateOutlet} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {DocumentStatusPipe} from "../../../pipe/document-status.pipe";
import {DialogModule} from "primeng/dialog";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {FileUtils} from "../../../../../shared/util/file.utils";
import {HourPipe} from "../../../../../shared/pipes/hour.pipe";
import {Tag} from "primeng/tag";
import {filter, finalize, Observable} from "rxjs";
import {BookingStatusService} from "../../../service/booking-status.service";
import {identity} from "lodash";
import {TableModule} from "primeng/table";
import {DocumentEditorComponent} from "../document-editor/document-editor.component";

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
    DialogModule,
    Button,
    HourPipe,
    Tag,
    NgTemplateOutlet,
    TableModule
  ]
})
export class BookingDetailComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly bookingStatusService = inject(BookingStatusService);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);

  protected readonly bookingIsAlwaysExclusive = bookingIsAlwaysExclusive;
  protected readonly Status = Status;

  @Input() public booking!: Booking;

  protected types!: BookingDocumentType[];
  protected loading = false;
  protected files: BookingDocument[] = [];
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
    this.bookingService.getBookingDocumentTypes().subscribe(res => {
      this.types = res;
      this.getFiles(this.booking.id);
    });
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
      this.files = res.sort((a, b) => a.typeId - b.typeId);
      this.types.filter(type => type.active && !this.files.some(file => file.typeId === type.id))
        .forEach(type => this.files.push(this.missingDocument(type.id)));
    });
  }

  private missingDocument(typeId: number): BookingDocument {
    return {bookingId: 0, fileName: "", id: 0, status: "PENDING", typeId: typeId};
  }

  protected downloadFile(file: BookingDocument) {
    this.loading = true;
    const tab = FileUtils.openPdfTab();
    this.bookingService.getPDF(file.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: pdf => FileUtils.openPdfFile(pdf, tab),
        error: () => tab.close()
      });
  }

  protected queryShowMoreData() {
    this.showMoreData = !this.showMoreData;
    if (this.showMoreData) localStorage.setItem("bd_show_more_data", "1");
    else localStorage.removeItem("bd_show_more_data");
  }

  protected getTypeName(id: number) {
    return this.types.find(type => type.id === id)?.name;
  }

  protected openDocumentEditor(document: BookingDocument) {
    const index = this.files.findIndex(doc => doc.id = document.id);
    const header = `Documento - ${this.getTypeName(document.typeId)}`;
    this.dialogService.openDialog(DocumentEditorComponent, header, "small", {document}).onClose.subscribe(result => {
      if (result === 'deleted') this.files.splice(index, 1);
      else if (result) this.files[index] = result;
    });
  }
}
