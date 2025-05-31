import {HttpResponse} from "@angular/common/http";
import {saveAs} from "file-saver";
import {Observable} from "rxjs";

export type FileType = "MEDICAL" | "PERSONAL" | "ECONOMIC" | "RECORD";

export class FileUtils {
  public static fileToFormData(file: File, paramName = "file"): FormData {
    const form = new FormData();
    form.append("file", file);
    return form;
  }

  public static filesToFormData(files: File[], paramName = "file"): FormData {
    const form = new FormData();
    files.forEach(file => {
      form.append('files', file);
    });
    return form;
  }

  public static downloadFile(response: HttpResponse<Blob>) {
    const blob = response.body!;
    saveAs(blob, this.getFilename(response.headers));
  }

  public static openFile(observable: Observable<HttpResponse<Blob>>) {
    const tab = window.open("", "_blank")!;
    observable.subscribe({
      next: response => {
        const blob = response.body!;
        if (blob) tab.location.assign(URL.createObjectURL(response.body));
        else tab.close();
      }, error: () => tab.close()
    });
  }

  private static getFilename(headers: any) {
    if (headers.get("X-Filename")) return headers.get("X-Filename");
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition) {
      const matches = /filename="([^"]+)"/.exec(contentDisposition);
      return matches?.[1] ?? "file";
    }
    return "file";
  }

  public static canOpenInNewTab(mimeType: string) {
    mimeType = mimeType?.toLowerCase();
    return mimeType === pdfMimeType || imageMimeTypes.includes(mimeType);
  }

  // File icons created by Roman Káčerek - Flaticon - https://www.flaticon.com/free-icons/xls
  public static getFileIcon(mimeType: string) {
    mimeType = mimeType?.toLowerCase();
    if (mimeType === pdfMimeType) {
      return "assets/file-icons/pdf.png";
    }
    if (docMimeTypes.includes(mimeType)) {
      return "assets/file-icons/word.png";
    }
    if (imageMimeTypes.includes(mimeType)) {
      return "assets/file-icons/image.png";
    }
    return "assets/file-icons/text.png";
  }
}

const pdfMimeType = "application/pdf";
const docMimeTypes = [
  "application/msword",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/vnd.oasis.opendocument.text",
  "application/rtf"
];

const imageMimeTypes = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/svg+xml"
];

export const docTypes = ".docx,.doc,.dot,.dotx,.odt,.rtf";
export const docAndPdfTypes = `${docTypes},.pdf`;
export const imageTypes = ".webp,.jpg,.png,.svg";
export const imageAndPdfTypes = `${imageTypes},.pdf`;
