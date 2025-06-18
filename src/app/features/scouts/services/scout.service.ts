import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, shareReplay} from "rxjs";
import {environment} from "../../../../environments/environment";
import {
  EconomicDonationEntry,
  EconomicEntry,
  Scout,
  ScoutFile,
  ScoutListData,
  ScoutRecord,
  ScoutType
} from "../models/scout.model";
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
import {InvoiceTypes} from "../../invoice/invoice.model";
import {FeeForm} from "../../donations/model/donation-form.model";

export type ScoutQuickFilter = "GROUP" | "ALL" | "IMAGE";

@Injectable({
  providedIn: 'root'
})
export class ScoutService {

  private readonly http = inject(HttpClient);
  private readonly scoutUrl = `${environment.apiUrl}/scout`;
  private scoutListFilter!: ScoutQuickFilter;

  set lastFilter(value: ScoutQuickFilter) {
    this.scoutListFilter = value;
  }

  get lastFilter(): ScoutQuickFilter {
    return this.scoutListFilter;
  }

  getAllFiltered(filter: PagedFilter): Observable<Page<ScoutListData>> {
    return this.http.get<Page<ScoutListData>>(this.scoutUrl, {params: new HttpParams({fromObject: filter})});
  }

  getAllForUserEdition(scoutTypes: ScoutType[]): Observable<ScoutListData[]> {
    return this.http.get<ScoutListData[]>(`${this.scoutUrl}/user-edition`, {params: new HttpParams({fromObject: {scoutTypes}})});
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

  deletePendingScout(scoutId: number) {
    return this.http.delete<void>(`${this.scoutUrl}/pending/${scoutId}`);
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

  addFees(feesForm: any) {
    const formData = new FormData();
    for (const key in feesForm) {
      formData.append(key, feesForm[key]);
    }
    return this.http.post<Scout>(`${this.scoutUrl}/economic/new-fees`, formData);
  }

  getDonationEntries(filter: PagedFilter): Observable<Page<EconomicDonationEntry>> {
    return this.http.get<Page<EconomicDonationEntry>>(`${this.scoutUrl}/economic/entries`, {params: new HttpParams({fromObject: filter})});
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

  findLastCensus(): Observable<number> {
    return this.http.get<number>(`${this.scoutUrl}/last-census`);
  }

  findLastExplorerCensus(): Observable<number> {
    return this.http.get<number>(`${this.scoutUrl}/last-explorer-census`);
  }

  findScoutsLikeHasBeenInGroup(preScoutId: number) {
    return this.http.get<Scout>(`${this.scoutUrl}/previous-scout/${preScoutId}`);
  }

  getTotalPendingRegistrations() {
    return this.http.get<number>(`${this.scoutUrl}/any-pending-registrations`);
  }

  private readonly donationTypeUrl: Observable<InvoiceTypes> = this.http.get<InvoiceTypes>(`${this.scoutUrl}/donation-types`).pipe(shareReplay(1));
  get getDonationTypes() {
    return this.donationTypeUrl;
  }

  getNewUsers(param: string[]) {
    const params: any = {usernames: param.map(user => user.toLowerCase())};
    return this.http.get<string[]>(`${this.scoutUrl}/new-users`, {params});
  }

  updateScoutUsers(scoutId: number, usernames: string[]) {
    return this.http.post<string[]>(`${this.scoutUrl}/update-scout-users/${scoutId}`, usernames);
  }
}
