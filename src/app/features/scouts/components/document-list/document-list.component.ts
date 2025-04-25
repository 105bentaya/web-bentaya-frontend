import {Component, inject, input, output, viewChild} from '@angular/core';
import {MemberFile} from "../../models/member.model";
import {TableModule} from "primeng/table";
import {DatePipe, NgClass, NgOptimizedImage} from "@angular/common";
import {FileUtils} from "../../../../shared/util/file.utils";
import {Tag} from "primeng/tag";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {finalize, forkJoin, Observable} from "rxjs";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ScoutService} from "../../services/scout.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-document-list',
  imports: [
    TableModule,
    Tag,
    DatePipe,
    FileUpload,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {

  protected alertService = inject(AlertService);
  protected scoutService = inject(ScoutService);
  protected confirmationService = inject(ConfirmationService);

  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;
  protected readonly FileUtils = FileUtils;

  documents = input.required<MemberFile[]>();
  filePetition = input<(file: File) => Observable<MemberFile>>();
  deletePetition = input<(fileId: number) => Observable<void>>();
  canEdit = input<boolean>(true);
  protected onUpload = output<MemberFile[]>();

  private readonly uploader = viewChild.required(FileUpload);

  protected loading: boolean = false;

  protected getFileIcon(file: MemberFile): string {
    return FileUtils.getFileIcon(file.mimeType);
  }

  get canEditDocuments() {
    return this.canEdit() && !!this.filePetition();
  }

  protected uploadFiles(event: FileUploadHandlerEvent) {
    if (this.loading) return;
    if (event.files?.length > 0) {
      const fileUploadPetitions = event.files.map(file => this.filePetition()!(file));
      this.loading = true;
      forkJoin(fileUploadPetitions)
        .pipe(finalize(() => {
          this.uploader().clear();
          this.loading = false;
        }))
        .subscribe({
          next: result => this.onUpload.emit(result),
          complete: () => this.alertService.sendBasicSuccessMessage("Documentos subidos correctamente")
        });
    } else {
      this.uploader().clear();
    }
  }

  protected deleteFile(fileToDelete: MemberFile, index: number) {
    if (this.loading) return;
    this.confirmationService.confirm({
      message: "¿Desea borrar este archivo? Esta acción no se podrá deshacer",
      accept: () => {
        this.loading = true;
        this.deletePetition()!(fileToDelete.id)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.documents().splice(index, 1);
              this.alertService.sendBasicSuccessMessage("Documento eliminado con éxito");
            }
          });
      }
    });
  }

  protected openUploader() {
    if (this.loading) return;
    this.uploader().el.nativeElement.getElementsByClassName("p-fileupload-choose-button")[0].click();
  }

  protected downloadFile(fileId: number) {
    this.loading = true;
    this.scoutService.getMemberFile(fileId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => FileUtils.downloadFile(res));
  }

  protected openFile(fileId: number) {
    FileUtils.openFile(this.scoutService.getMemberFile(fileId));
  }
}
