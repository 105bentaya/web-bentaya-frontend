import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {DocumentStatusPipe} from "../../pipe/document-status.pipe";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {BookingDocument, BookingDocumentType} from "../../model/booking-document.model";
import {BookingService} from "../../service/booking.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {finalize, forkJoin} from "rxjs";
import {Tooltip} from "primeng/tooltip";
import {Tag} from "primeng/tag";
import {FileUtils} from "../../../../shared/util/file.utils";

@Component({
  selector: 'app-document-file-uploader',
  imports: [
    Button,
    DocumentStatusPipe,
    FileUpload,
    PrimeTemplate,
    Tooltip,
    Tag
  ],
  templateUrl: './document-file-uploader.component.html',
  styleUrl: './document-file-uploader.component.scss'
})
export class DocumentFileUploaderComponent {

  private readonly bookingService = inject(BookingService);
  private readonly alertService = inject(AlertService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;

  @Input() type!: BookingDocumentType;
  @Input() files: BookingDocument[] = [];
  @Input() bookingId!: number;
  @Output() openHelpPanel = new EventEmitter<void>();
  @Output() reloadFiles = new EventEmitter<void>();

  @ViewChild('uploader') private readonly uploader!: FileUpload;

  protected loading: boolean = false;

  protected downloadFile(file: BookingDocument) {
    this.loading = true;
    this.bookingService.getPDF(file.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(pdf => FileUtils.downloadFile(pdf));
  }

  protected deleteFile(file: BookingDocument) {
    this.confirmationService.confirm({
      message: "¿Desea borrar este documento? Esta acción no se puede revertir.",
      header: "Borrar documento",
      accept: () => {
        this.loading = true;
        this.bookingService.deleteDocument(file.id)
          .pipe(finalize(() => {
            this.uploader.clear();
            this.reloadFiles.emit();
            this.loading = false;
          }))
          .subscribe({
            next: () => {
              this.alertService.sendBasicSuccessMessage("Documento eliminado");
            }
          });
      }
    });
  }

  protected uploadFiles(event: FileUploadHandlerEvent) {
    const fileUploadPetitions = event.files.map(file => this.bookingService.uploadBookingDocument(this.bookingId, file, this.type.id));
    this.loading = true;
    forkJoin(fileUploadPetitions)
      .pipe(finalize(() => {
        this.reloadFiles.emit();
        this.uploader.clear();
        this.loading = false;
      }))
      .subscribe({
        complete: () => this.alertService.sendBasicSuccessMessage("Documentos subidos correctamente")
      });
  }

  protected documentCanBeDeleted(document: BookingDocument) {
    return document.status !== 'ACCEPTED';
  }
}
