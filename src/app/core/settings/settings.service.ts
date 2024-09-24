import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Setting} from "./setting.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private http = inject(HttpClient);

  private settingsUrl = `${environment.apiUrl}/settings`;

  getAll(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.settingsUrl);
  }

  getByName(name: string): Observable<Setting> {
    return this.http.get<Setting>(`${this.settingsUrl}/get/${name}`);
  }

  update(setting: Setting): Observable<Setting> {
    return this.http.put<Setting>(`${this.settingsUrl}/${setting.name}`, setting.value);
  }
}
