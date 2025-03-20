import {HttpResponse} from "@angular/common/http";
import {saveAs} from "file-saver";

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

  public static fileHttpGetOptions(): any {
    return {responseType: 'blob', observe: 'response'};
  }

  public static downloadFile(response: HttpResponse<Blob>) {
    const blob = response.body!;
    saveAs(blob, this.getFilename(response.headers));
  }

  public static openPdfTab() {
    return window.open("", "_blank");
  }

  public static openPdfFile(response: HttpResponse<Blob>, tab: Window) {
    const blob = response.body!;
    if (blob) tab.location.assign(URL.createObjectURL(response.body));
    else tab.close();
  }

  private static getFilename(headers: any) {
    console.log(headers);
    if (headers.get("X-Filename")) return headers.get("X-Filename");
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition) {
      const matches = /filename="([^"]+)"/.exec(contentDisposition);
      return matches && matches[1] ? matches[1] : "file";
    }
    return "file";
  }
}


export const docTypes = ".docx,.doc,.dot,.dotx,.odt,.rtf";
