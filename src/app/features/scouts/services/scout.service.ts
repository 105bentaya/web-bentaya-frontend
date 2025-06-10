import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {EconomicEntry, Scout, ScoutFile, ScoutRecord, UserScout} from "../models/scout.model";
import {FileType, FileUtils} from "../../../shared/util/file.utils";
import {
  EconomicDataForm,
  EconomicEntryForm,
  NewScoutForm,
  PersonalDataForm,
  ScoutContactForm,
  ScoutHistoryForm,
  ScoutInfoForm,
  ScoutMedicalForm
} from "../models/scout-form.model";
import {PagedFilter} from "../../../shared/model/filter.model";
import {Page} from "../../../shared/model/page.model";

export type ScoutQuickFilter = "GROUP" | "ALL" | "IMAGE";

@Injectable({
  providedIn: 'root'
})
export class ScoutService {

  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.apiUrl}/scout`;
  private scoutListFilter!: ScoutQuickFilter;
  public lastTab: number = 0;

  set lastFilter(value: ScoutQuickFilter) {
    this.scoutListFilter = value;
  }

  get lastFilter(): ScoutQuickFilter {
    return this.scoutListFilter;
  }

  getAllFiltered(filter: PagedFilter): Observable<Page<Scout>> {
    return this.http.get<Page<Scout>>(this.scoutUrl, {params: new HttpParams({fromObject: filter})});
  }

  getAllByCurrentUser(): Observable<UserScout[]> {
    return this.http.get<UserScout[]>(`${this.scoutUrl}/user`);
  }

  //new

  getById(id: any) {
    return this.http.get<Scout>(`${this.scoutUrl}/${id}`);
  }

  downloadDocument(documentId: number) {
    return this.http.get(`${this.scoutUrl}/document/${documentId}`, {responseType: 'blob', observe: 'response'});
  }

  uploadDocument(scoutId: number, file: File, fileType: FileType, customName?: string) {
    return this.http.post<ScoutFile>(`${this.scoutUrl}/document/${scoutId}/${fileType}`, FileUtils.fileToFormData(file, customName));
  }

  deleteDocument(scoutId: number, fileId: number, fileType: FileType) {
    return this.http.delete<void>(`${this.scoutUrl}/document/${scoutId}/${fileId}/${fileType}`);
  }

  saveNewScout(scoutForm: NewScoutForm) {
    return this.http.post<Scout>(`${this.scoutUrl}/new`, scoutForm);
  }

  updatePersonalData(id: number, personalDataForm: PersonalDataForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/personal/${id}`, personalDataForm);
  }

  updateScoutContacts(id: number, contactList: ScoutContactForm[]) {
    return this.http.patch<Scout>(`${this.scoutUrl}/contact/${id}`, {contactList});
  }

  updateMedicalData(id: number, medicalDataForm: ScoutMedicalForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/medical/${id}`, medicalDataForm);
  }

  updateScoutInfo(id: number, scoutInfoForm: ScoutInfoForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/scout-info/${id}`, scoutInfoForm);
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

  updateScoutEconomicData(scoutId: number, scoutInfoForm: EconomicDataForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/economic/${scoutId}`, scoutInfoForm);
  }

  addEntry(scoutId: number, form: EconomicEntryForm): Observable<EconomicEntry> {
    return this.http.post<EconomicEntry>(`${this.scoutUrl}/economic/entry/${scoutId}`, form);
  }

  updateEntry(scoutId: number, entryId: number, form: EconomicEntryForm): Observable<EconomicEntry> {
    return this.http.put<EconomicEntry>(`${this.scoutUrl}/economic/entry/${scoutId}/${entryId}`, form);
  }

  deleteEntry(scoutId: number, entryId: number): Observable<void> {
    return this.http.delete<void>(`${this.scoutUrl}/economic/entry/${scoutId}/${entryId}`);
  }

  updateScoutHistory(id: number, scoutHistoryForm: ScoutHistoryForm) {
    return this.http.patch<Scout>(`${this.scoutUrl}/scout-history/${id}`, scoutHistoryForm);
  }
}
