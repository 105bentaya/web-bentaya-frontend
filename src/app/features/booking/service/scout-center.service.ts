import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ScoutCenter, ScoutCenterFile, ScoutCenterInformation, ScoutCenterWithFiles} from "../model/scout-center.model";
import {Observable} from "rxjs";
import {FileUtils} from "../../../shared/util/file.utils";

@Injectable({
  providedIn: 'root'
})
export class ScoutCenterService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/scout-center`;

  public getAllWithFiles(): Observable<ScoutCenterWithFiles[]> {
    return this.http.get<ScoutCenterWithFiles[]>(this.url);
  }

  public getAll(): Observable<ScoutCenter[]> {
    return this.http.get<ScoutCenter[]>(`${this.url}/public`);
  }

  public getAllInformation(): Observable<ScoutCenterInformation[]> {
    return this.http.get<ScoutCenterInformation[]>(`${this.url}/public/info`);
  }

  public getRuleFile(centerId: number,): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/rules/${centerId}`, {responseType: 'blob', observe: 'response'});
  }

  public getIncidenceFile(centerId: number,): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/incidences/${centerId}`, {responseType: 'blob', observe: 'response'});
  }

  public getAttendanceFile(centerId: number,): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/attendance/${centerId}`, {responseType: 'blob', observe: 'response'});
  }

  public uploadRuleFile(centerId: number, file: File): Observable<ScoutCenterFile> {
    return this.http.post<ScoutCenterFile>(`${this.url}/rules/${centerId}`, FileUtils.fileToFormData(file));
  }

  public uploadIncidenceFile(centerId: number, file: File): Observable<ScoutCenterFile> {
    return this.http.post<ScoutCenterFile>(`${this.url}/incidences/${centerId}`, FileUtils.fileToFormData(file));
  }

  public uploadAttendanceFile(centerId: number, file: File): Observable<ScoutCenterFile> {
    return this.http.post<ScoutCenterFile>(`${this.url}/attendance/${centerId}`, FileUtils.fileToFormData(file));
  }

  public uploadMainPhoto(centerId: number, file: File): Observable<ScoutCenterFile> {
    return this.http.post<ScoutCenterFile>(`${this.url}/main-photo/${centerId}`, FileUtils.fileToFormData(file));
  }

  public uploadPhotos(centerId: number, files: File[]) {
    return this.http.post<ScoutCenterFile[]>(`${this.url}/photos/${centerId}`, FileUtils.filesToFormData(files));
  }

  public removePhoto(centerId: number, photoId: number) {
    return this.http.delete<ScoutCenterFile[]>(`${this.url}/photos/${centerId}/${photoId}`);
  }

  getPhotoUrl(uuid: string) {
    return `${this.url}/public/photo/${uuid}`;
  }

  updateScoutCenter(scoutCenter: ScoutCenter): Observable<ScoutCenter> {
    return this.http.post<ScoutCenter>(`${this.url}/${scoutCenter.id}`, scoutCenter);
  }
}
