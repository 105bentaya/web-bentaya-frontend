import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DonationForm} from "../model/donation-form.model";
import {PaymentInfo} from "../../../shared/model/payment-info.model";
import {Donation} from "../model/donation.model";

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/donation`;

  getAll(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.url);
  }

  getNewDonationInfo(donationId: number, urls: { okUrl: string; koUrl: string }): Observable<PaymentInfo> {
    return this.http.post<PaymentInfo>(`${this.url}/public/donation-data/${donationId}`, urls);
  }

  sendForm(donationForm: DonationForm): Observable<number> {
    return this.http.post<number>(`${this.url}/public`, donationForm);
  }

  generateDownloadFile(form: any) {
    return this.http.post(`${this.url}/donation-file`, form, {responseType: 'blob', observe: 'response'});
  }
}
