import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Invoice, InvoiceData} from "./invoice.model";
import {Page} from "../../shared/model/page.model";
import {Filter} from "../../shared/model/filter.model";

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    private readonly http = inject(HttpClient);
    private readonly invoiceUrl = `${environment.apiUrl}/invoice`;

    getAll(filter: Filter): Observable<Page<Invoice>> {
        return this.http.get<Page<Invoice>>(this.invoiceUrl, {
            params: new HttpParams({fromObject: filter})
        });
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
}
