import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PurchaseInformation, PurchaseInformationForm} from "../models/purchase-information.model";
import {PaymentInfo} from "../../../shared/model/payment-info.model";

@Injectable({
  providedIn: 'root'
})
export class ShopPaymentService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shop/payment`;
  private scoutShopUrl = `${environment.webUrl}/tienda-scout`;
  private cartUrl = `${environment.webUrl}/tienda-scout/carrito`;

  public getStartedPurchase(): Observable<PurchaseInformation> {
    return this.http.get<PurchaseInformation>(`${this.apiUrl}/started`);
  }

  public getOngoingPurchase(): Observable<PurchaseInformation> {
    return this.http.get<PurchaseInformation>(`${this.apiUrl}/ongoing`);
  }

  public continueOngoingPurchase(): Observable<PaymentInfo> {
    const params = {okUrl: this.scoutShopUrl, koUrl: this.cartUrl};
    return this.http.get<PaymentInfo>(`${this.apiUrl}/continue`, {params});
  }

  public startPurchase(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/start`, null);
  }

  public cancelPurchase(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cancel`, null);
  }

  public confirmPurchase(purchaseInfo: PurchaseInformationForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirm`, purchaseInfo);
  }
}
