import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Payment} from "../model/payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/tpv`;

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.url);
  }
}
