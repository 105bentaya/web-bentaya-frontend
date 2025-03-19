import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ScoutCenter} from "../model/scout-center.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoutCenterService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/scout-center`;

  public getAll(): Observable<ScoutCenter[]> {
    return this.http.get<ScoutCenter[]>(`${this.url}/public`);
  }
}
