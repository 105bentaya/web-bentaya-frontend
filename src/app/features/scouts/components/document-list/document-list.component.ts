import {Component, inject, input, output, viewChild} from '@angular/core';
import {MemberFile} from "../../models/member.model";
import {TableModule} from "primeng/table";
import {DatePipe, NgClass} from "@angular/common";
import {FileUtils} from "../../../../shared/util/file.utils";
import {Tag} from "primeng/tag";
import {FileUpload, FileUploadHandlerEvent} from "primeng/fileupload";
import {maxFileUploadByteSize} from "../../../../shared/constant";
import {finalize, forkJoin, noop, Observable} from "rxjs";
import {AlertService} from "../../../../shared/services/alert-service.service";

@Component({
  selector: 'app-document-list',
  imports: [
    TableModule,
    Tag,
    DatePipe,
    FileUpload,
    NgClass
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {
  protected readonly FileUtils = FileUtils;

  documents = input.required<MemberFile[]>();
  filePetition = input<(file: File) => Observable<MemberFile>>();
  deletePetition = input<(fileId: number) => Observable<void>>();
  canEdit = input<boolean>(true);
  protected onUpload = output<MemberFile[]>();

  protected loading: boolean = false;
  protected alertService = inject(AlertService);

  private readonly uploader = viewChild.required(FileUpload);
  protected readonly maxFileUploadByteSize = maxFileUploadByteSize;

  protected getFileIcon(file: MemberFile): string {
    if (file.name.endsWith('.pdf')) {
      return "assets/pdf.png";
    }
    return "assets/text.png";
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

  protected openUploader() {
    if (this.loading) return;
    this.uploader().el.nativeElement.getElementsByClassName("p-fileupload-choose-button")[0].click();
  }

  protected readonly noop = noop;
}
