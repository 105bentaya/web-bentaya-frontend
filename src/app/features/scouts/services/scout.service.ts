import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OldScout} from "../models/scout.model";
import {environment} from "../../../../environments/environment";
import {ScoutUsernamesUpdate} from "../models/scout-usernames-update.model";
import {Scout, ScoutFile, ScoutRecord} from "../models/member.model";
import {FileUtils} from "../../../shared/util/file.utils";
import {PersonalDataForm, ScoutContactForm, ScoutInfoForm, ScoutMedicalForm} from "../models/member-form.model";

@Injectable({
  providedIn: 'root'
})
export class ScoutService {

  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.apiUrl}/scout`;

  getAll(): Observable<OldScout[]> {
    return this.http.get<OldScout[]>(this.scoutUrl);
  }

  getAllAndDisabled(): Observable<OldScout[]> {
    return this.http.get<OldScout[]>(`${this.scoutUrl}/all`);
  }

  getAllWithoutImageAuthorization(): Observable<OldScout[]> {
    return this.http.get<OldScout[]>(`${this.scoutUrl}/image`);
  }

  getAllByCurrentGroup(): Observable<OldScout[]> {
    return this.http.get<OldScout[]>(`${this.scoutUrl}/group`);
  }

  getAllByCurrentUser(): Observable<OldScout[]> {
    return this.http.get<OldScout[]>(`${this.scoutUrl}/user`);
  }

  getScoutUsernames(scoutId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.scoutUrl}/scout-form/${scoutId}`);
  }

  updateScoutUsers(scoutId: number, users: string[]) {
    return this.http.put(`${this.scoutUrl}/scout-form/${scoutId}`, users.map(user => user.toLowerCase()));
  }

  getScoutUsernamesUpdateInfo(newUsernames: string[], scoutId?: number): Observable<ScoutUsernamesUpdate> {
    const params: any = {};
    if (scoutId) params.scoutId = scoutId;
    if (newUsernames) params.usernames = newUsernames.map(user => user.toLowerCase());
    return this.http.get<ScoutUsernamesUpdate>(`${this.scoutUrl}/scout-form-usernames`, {params});
  }

  save(scout: OldScout): Observable<OldScout> {
    return this.http.post<OldScout>(this.scoutUrl, scout);
  }

  saveFromPreScout(scout: OldScout, id: number): Observable<OldScout> {
    return this.http.post<OldScout>(`${this.scoutUrl}/${id}`, scout);
  }

  update(scout: OldScout): Observable<OldScout> {
    return this.http.put<OldScout>(this.scoutUrl, scout);
  }

  disable(scout: OldScout) {
    return this.http.delete(`${this.scoutUrl}/disable/${scout.id}`);
  }

  delete(scout: OldScout) {
    return this.http.delete(`${this.scoutUrl}/delete/${scout.id}`);
  }

  //new

  getById(id: any) {
    return this.http.get<Scout>(`${this.scoutUrl}/${id}`);
  }

  getMemberFile(id: number) {
    return this.http.get(`${this.scoutUrl}/document/${id}`, {responseType: 'blob', observe: 'response'});
  }

  updatePersonalData(id: number, personalDataForm: PersonalDataForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/personal/${id}`, personalDataForm);
  }

  uploadPersonalDataDocs(id: number, file: File) {
    return this.http.post<ScoutFile>(`${this.scoutUrl}/personal/docs/${id}`, FileUtils.fileToFormData(file));
  }

  deletePersonalDataDocs(id: number, fileId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/personal/docs/${id}/${fileId}`);
  }

  updateScoutContacts(id: number, contactList: ScoutContactForm[]) {
    return this.http.patch<Scout>(`${this.scoutUrl}/contact/${id}`, {contactList});
  }

  updateMedicalData(id: number, medicalDataForm: ScoutMedicalForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/medical/${id}`, medicalDataForm);
  }

  uploadMedicalDocs(id: number, file: File) {
    return this.http.post<ScoutFile>(`${this.scoutUrl}/medical/docs/${id}`, FileUtils.fileToFormData(file));
  }

  deleteMedicalDocs(id: number, fileId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/medical/docs/${id}/${fileId}`);
  }

  updateScoutInfo(id: number, scoutInfoForm: ScoutInfoForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/scout-info/${id}`, scoutInfoForm);
  }

  uploadRecordDocs(id: number, file: File) {
    return this.http.post<ScoutFile>(`${this.scoutUrl}/scout-info/record-documents/${id}`, FileUtils.fileToFormData(file));
  }

  deleteRecordDocs(id: number, fileId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/scout-info/record-documents/${id}/${fileId}`);
  }

  addScoutRecord(scoutId: number, record: ScoutRecord) {
    return this.http.post<ScoutRecord>(`${this.scoutUrl}/scout-info/record/${scoutId}`, record);
  }

  updateScoutRecord(scoutId: number, recordId: number, record: ScoutRecord) {
    return this.http.put<ScoutRecord>(`${this.scoutUrl}/scout-info/record/${scoutId}/${recordId}`, record);
  }

  deleteScoutRecord(scoutId: number, recordId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/scout-info/record/${scoutId}/${recordId}`);
  }
}
