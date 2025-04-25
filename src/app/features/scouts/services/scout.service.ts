import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Scout} from "../models/scout.model";
import {environment} from "../../../../environments/environment";
import {ScoutUsernamesUpdate} from "../models/scout-usernames-update.model";
import {Member, MemberFile, ScoutContact} from "../models/member.model";
import {FileUtils} from "../../../shared/util/file.utils";

@Injectable({
  providedIn: 'root'
})
export class ScoutService {

  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.apiUrl}/scout`;

  getAll(): Observable<Scout[]> {
    return this.http.get<Scout[]>(this.scoutUrl);
  }

  getAllAndDisabled(): Observable<Scout[]> {
    return this.http.get<Scout[]>(`${this.scoutUrl}/all`);
  }

  getAllWithoutImageAuthorization(): Observable<Scout[]> {
    return this.http.get<Scout[]>(`${this.scoutUrl}/image`);
  }

  getAllByCurrentGroup(): Observable<Scout[]> {
    return this.http.get<Scout[]>(`${this.scoutUrl}/group`);
  }

  getAllByCurrentUser(): Observable<Scout[]> {
    return this.http.get<Scout[]>(`${this.scoutUrl}/user`);
  }

  getScoutUsernames(scoutId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.scoutUrl}/scout-form/${scoutId}`);
  }

  updateScoutUsers(scoutId: number, users: string[]) {
    return this.http.put(`${this.scoutUrl}/scout-form/${scoutId}`, users.map(user => user.toLowerCase()));
  }

  getScoutUsernamesUpdateInfo(newUsernames: string[], scoutId?: number): Observable<ScoutUsernamesUpdate> {
    let params: any = {};
    if (scoutId) params.scoutId = scoutId;
    if (newUsernames) params.usernames = newUsernames.map(user => user.toLowerCase());
    return this.http.get<ScoutUsernamesUpdate>(`${this.scoutUrl}/scout-form-usernames`, {params});
  }

  save(scout: Scout): Observable<Scout> {
    return this.http.post<Scout>(this.scoutUrl, scout);
  }

  saveFromPreScout(scout: Scout, id: number): Observable<Scout> {
    return this.http.post<Scout>(`${this.scoutUrl}/${id}`, scout);
  }

  update(scout: Scout): Observable<Scout> {
    return this.http.put<Scout>(this.scoutUrl, scout);
  }

  disable(scout: Scout) {
    return this.http.delete(`${this.scoutUrl}/disable/${scout.id}`);
  }

  delete(scout: Scout) {
    return this.http.delete(`${this.scoutUrl}/delete/${scout.id}`);
  }

  //new

  getById(id: any) {
    return this.http.get<Member>(`${this.scoutUrl}/${id}`);
  }

  getMemberFile(id: number) {
    return this.http.get(`${this.scoutUrl}/document/${id}`, {responseType: 'blob', observe: 'response'});
  }

  updatePersonalData(id: number, personalDataForm: any) {
    return this.http.patch<Member>(`${this.scoutUrl}/personal/${id}`, personalDataForm);
  }

  uploadPersonalDataDocs(id: number, file: File) {
    return this.http.post<MemberFile>(`${this.scoutUrl}/personal/docs/${id}`, FileUtils.fileToFormData(file));
  }

  deletePersonalDataDocs(id: number, fileId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/personal/docs/${id}/${fileId}`);
  }

  updateScoutContacts(id: number, contactList: ScoutContact[]) {
    return this.http.patch<Member>(`${this.scoutUrl}/contact/${id}`, {contactList});
  }
}
