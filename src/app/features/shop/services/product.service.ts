import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shop/product`;

  public getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  public getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  public getPhotoUrl(uuid: string) {
    return `${this.apiUrl}/public/photo/${uuid}`;
  }

  public save(form: any, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("form", new Blob([JSON.stringify(form)], {type: "application/json"}));
    return this.http.post<Product>(this.apiUrl, formData);
  }

  public update(id: number, form: any, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("form", new Blob([JSON.stringify(form)], {type: "application/json"}));
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }
}
