import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CartItem, CartProductForm} from "../models/cart.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shop/cart`;

  public getUserCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  public getCartStatus(): Observable<string> {
    return this.http.get(`${this.apiUrl}/status`, {responseType: 'text'});
  }

  public updateProduct(product: CartProductForm): Observable<void> {
    return this.http.put<void>(this.apiUrl, product);
  }

  public emptyCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
