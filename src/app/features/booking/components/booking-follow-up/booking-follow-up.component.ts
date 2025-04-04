import {Component, inject, OnInit} from '@angular/core';
import {BookingService} from "../../service/booking.service";
import {Booking, bookingIsAlwaysExclusive} from "../../model/booking.model";
import {FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {BookingDocument, BookingDocumentType} from "../../model/booking-document.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {Status} from "../../constant/status.constant";
import {BookingStatusUpdateComponent} from "../management/booking-status-update/booking-status-update.component";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {BookingStatusPipe} from '../../../scout-center/scout-center-status.pipe';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Button} from "primeng/button";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {docAndPdfTypes, FileUtils} from "../../../../shared/util/file.utils";
import {ScoutCenterService} from "../../../scout-center/scout-center.service";
import {BookingFetcherService} from "../../service/booking-fetcher.service";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {BookingManagementService} from "../../service/booking-management.service";
import {Tag} from "primeng/tag";
import {Dialog} from "primeng/dialog";
import {DocumentFileUploaderComponent} from "../document-file-uploader/document-file-uploader.component";
import {cancelBookingMessage, confirmDocumentsMessage} from "../../constant/confirm-messages.constants";
import {BookingStatusService} from "../../service/booking-status.service";
import {filter, finalize} from "rxjs";
import {identity} from "lodash";

@Component({
  selector: 'app-booking-follow-up',
  templateUrl: './booking-follow-up.component.html',
  styleUrls: ['./booking-follow-up.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    DatePipe,
    FieldsetModule,
    DividerModule,
    CurrencyPipe,
    BookingStatusPipe,
    FileUploadModule,
    BasicLoadingInfoComponent,
    RouterLink,
    Button,
    GeneralAButtonComponent,
    Tag,
    Dialog,
    DocumentFileUploaderComponent
  ]
})
export class BookingFollowUpComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly bookingStatusService = inject(BookingStatusService);
  private readonly bookingFetcherService = inject(BookingFetcherService);
  private readonly bookingManagement = inject(BookingManagementService);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly scoutCenterService = inject(ScoutCenterService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly bookingIsAlwaysExclusive = bookingIsAlwaysExclusive;
  protected readonly Status = Status;
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly docAndPdfTypes = docAndPdfTypes;

  protected showMoreData = false;
  protected showHelpDialog: boolean = false;

  protected bookingId: number;
  protected booking!: Booking;
  protected files: BookingDocument[] = [];
  protected types: BookingDocumentType[] = [];

  protected loading = false;

  constructor() {
    this.bookingId = this.route.snapshot.params['bookingId'];
  }

  ngOnInit(): void {
    this.bookingService.getBookingDocumentActiveTypes().subscribe(a => this.types = a);
    this.getBooking();
  }

  private getBooking(): void {
    this.bookingFetcherService.getById(this.bookingId).subscribe(data => {
      this.booking = data;
      this.getFiles();
    });
  }

  protected getFiles() {
    if (this.booking.status === Status.RESERVED) {
      this.bookingService.getBookingDocuments(this.bookingId).subscribe(res => this.files = res);
    }
  }

  protected cancelReservation() {
    const dialogData: any = {
      textAreaLabel: "Motivo de la cancelación",
      textRequired: true
    };

    if (this.booking.status == Status.OCCUPIED) {
      dialogData["message"] = cancelBookingMessage;
    }

    this.dialogService.openDialog(BookingStatusUpdateComponent, "Cancelar reserva", "small", dialogData)
      .onClose
      .pipe(filter(identity))
      .subscribe(({observations}) => this.cancelBooking(observations));
  }

  private cancelBooking(observations: string) {
    this.loading = true;
    this.bookingStatusService.cancelBooking(this.booking.id, {observations})
      .subscribe({
        next: () => this.getBooking(),
        error: () => this.loading = false
      });
  }

  protected askFormConfirmDocuments() {
    this.confirmationService.confirm({
      header: "Confirmar",
      message: confirmDocumentsMessage,
      accept: () => this.confirmDocuments()
    });
  }

  private confirmDocuments() {
    this.loading = true;
    this.bookingStatusService.confirmDocuments(this.bookingId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => this.alertService.sendBasicSuccessMessage("Se ha mandado el aviso correctamente"));
  }

  protected goBack() {
    this.router.navigate([`/centros-scout/seguimiento/${this.bookingManagement.getLastRoute()}`], {queryParams: this.bookingManagement.getLastParams()});
  }

  protected uploadIncidenceFile(event: FileUploadHandlerEvent) {
    this.loading = true;
    this.bookingService.uploadBookingIncidencesFile(this.bookingId, event.files[0])
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.alertService.sendBasicSuccessMessage("El registro de incidencias y estados se ha subido satisfactoriamente");
        this.getBooking();
      });
  }

  protected downloadRuleFile(centerId: number) {
    this.scoutCenterService.getRuleFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }

  protected downloadIncidenceFile(centerId: number) {
    this.scoutCenterService.getIncidenceFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }

  protected downloadAttendanceFile(centerId: number) {
    this.scoutCenterService.getAttendanceFile(centerId).subscribe(result => FileUtils.downloadFile(result));
  }

  protected showBookingActions() {
    return this.booking.status != Status.REJECTED &&
      this.booking.status != Status.CANCELED &&
      new Date(this.booking.startDate) > new Date();
  }

  protected getFilesByType(type: BookingDocumentType) {
    return this.files.filter(file => file.typeId === type.id);
  }
}
