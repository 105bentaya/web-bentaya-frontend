import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Invoice, InvoiceData} from "./invoice.model";
import {Page} from "../../shared/model/page.model";
import {PagedFilter} from "../../shared/model/filter.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private readonly http = inject(HttpClient);
  private readonly invoiceUrl = `${environment.apiUrl}/invoice`;

  getAll(filter: PagedFilter): Observable<Page<Invoice>> {
    return this.http.get<Page<Invoice>>(this.invoiceUrl, {
      params: new HttpParams({fromObject: filter})
    });
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceUrl}/${id}`);
  }

  getData(): Observable<InvoiceData> {
    return this.http.get<InvoiceData>(`${this.invoiceUrl}/data`);
  }

  save(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.invoiceUrl, invoice);
  }

  update(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(this.invoiceUrl, invoice);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.invoiceUrl}/${id}`);
  }

  uploadFile(invoiceId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<void>(`${this.invoiceUrl}/file/${invoiceId}`, formData);
  }

  deleteFile(fileId: number) {
    return this.http.delete<void>(`${this.invoiceUrl}/file/${fileId}`);
  }

  getFileUrl(fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.invoiceUrl}/file/${fileId}`, {responseType: 'blob', observe: 'response'});
  }
}
