import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {tap} from 'rxjs';
import {saveAs} from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class ScoutExcelService {

  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.apiUrl}/scout`;
  private currentExcelFilter: string[] = [];
  private readonly initialExcelFilter: string[] = [
    "census", "personalData.name", "personalData.feltName", "personalData.surname", "personalData.birthday",
    "personalData.gender", "personalData.idDocument.number", "custom.group", "personalData.residenceMunicipality"
  ];

  getExcelFilter() {
    const savedData = localStorage.getItem("scoutExcelFilter");
    this.currentExcelFilter = savedData ? JSON.parse(savedData) : this.initialExcelFilter;
    return this.currentExcelFilter;
  }

  updateCurrentExcelFilter(excelFields: string[]) {
    this.currentExcelFilter = excelFields;
    localStorage.setItem("scoutExcelFilter", JSON.stringify(this.currentExcelFilter));
  }

  downloadScoutExcel(filter: any, fields: any) {
    return this.http.post(`${this.scoutUrl}/excel`, {fields, filter}, {responseType: 'blob'}).pipe(
      tap((blob: Blob) => {
        const filename = `Censo_Bentaya_${new Date().toISOString().slice(0, 19)}.xlsx`;
        saveAs(blob, filename);
      })
    );
  }

}
