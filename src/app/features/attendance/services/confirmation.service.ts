import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {ScouterListInfo} from "../models/scouter-list-info.model";
import {UserListInfo} from "../models/user-list-info.model";
import {Confirmation} from "../models/confirmation.model";
import {EventAttendanceInfo} from "../models/event-attendance-info.model";
import {EventBasicAttendanceInfo} from "../models/event-basic-attendance-info.model";
import {saveAs} from "file-saver";
import {LoggedUserDataService} from "../../../core/auth/services/logged-user-data.service";

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private readonly http = inject(HttpClient);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly confirmationUrl = `${environment.apiUrl}/confirmation`;

  getAllBasicScouterInfo(): Observable<ScouterListInfo[]> {
    return this.http.get<ScouterListInfo[]>(`${this.confirmationUrl}/basic`);
  }

  getAllBasicUserInfo(): Observable<UserListInfo[]> {
    return this.http.get<UserListInfo[]>(`${this.confirmationUrl}/user`);
  }

  getById(scoutId: number, eventId: number): Observable<Confirmation> {
    return this.http.get<Confirmation>(`${this.confirmationUrl}/form/${scoutId}/${eventId}`);
  }

  updateByUser(confirmation: Confirmation): Observable<Confirmation> {
    return this.http.put<Confirmation>(`${this.confirmationUrl}/user`, confirmation);
  }

  updateByScouter(confirmation: Confirmation): Observable<Confirmation> {
    return this.http.put<Confirmation>(`${this.confirmationUrl}/scouter`, confirmation);
  }

  getEventAttendanceInfo(eventId: number): Observable<EventAttendanceInfo[]> {
    return this.http.get<EventAttendanceInfo[]>(`${this.confirmationUrl}/info/${eventId}`);
  }

  getEventBasicAttendanceInfo(eventId: number): Observable<EventBasicAttendanceInfo[]> {
    return this.http.get<EventBasicAttendanceInfo[]>(`${this.confirmationUrl}/event/${eventId}`);
  }

  downloadCourseAttendanceExcelReport() {
    return this.http
      .get(
        `${this.confirmationUrl}/courseAttendanceExcel`,
        {responseType: "blob"}
      )
      .pipe(tap((data: Blob) => {
        saveAs(data,
          `Asistencia_${this.loggedUserData.getGroup()?.name}_RS_Actual.xlsx`);
      }));
  }
}
