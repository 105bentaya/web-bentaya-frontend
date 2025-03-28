import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Setting, SettingType} from "./setting.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly http = inject(HttpClient);
  private readonly settingsUrl = `${environment.apiUrl}/settings`;

  getGeneralSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.settingsUrl);
  }

  getBookingSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${this.settingsUrl}/booking`);
  }

  getByName(name: SettingType): Observable<Setting> {
    return this.http.get<Setting>(`${this.settingsUrl}/get/${name}`);
  }

  update(settingName: SettingType, settingValue: any): Observable<Setting> {
    return this.http.put<Setting>(`${this.settingsUrl}/${settingName}`, {settingValue});
  }
}
