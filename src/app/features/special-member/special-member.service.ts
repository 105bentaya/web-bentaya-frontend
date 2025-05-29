import {inject, Injectable} from '@angular/core';
import {
  FilterResult,
  SpecialMemberBasicData,
  SpecialMemberDetail,
  SpecialMemberRole
} from "./models/special-member.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {SpecialMemberForm} from "./models/special-member-form.model";

@Injectable({
  providedIn: 'root'
})
export class SpecialMemberService {

  private readonly http = inject(HttpClient);
  private readonly specialMemberUrl = `${environment.apiUrl}/special-member`;

  constructor() {
  }

  getSpecialMembers() {
    return this.http.get<SpecialMemberBasicData[]>(this.specialMemberUrl);
  }

  getById(id: number) {
    return this.http.get<SpecialMemberDetail>(`${this.specialMemberUrl}/${id}`);
  }

  findLastCensus(role: SpecialMemberRole): Observable<number> {
    return this.http.get<number>(`${this.specialMemberUrl}/last-census/${role}`);
  }

  searchScout(filter: string): Observable<FilterResult[]> {
    return this.http.get<FilterResult[]>(`${this.specialMemberUrl}/search-scout`, {params: {filter}});
  }

  searchSpecialMember(filter: string): Observable<FilterResult[]> {
    return this.http.get<FilterResult[]>(`${this.specialMemberUrl}/search-special-member`, {params: {filter}});
  }

  saveSpecialMember(form: SpecialMemberForm) {
    return this.http.post<SpecialMemberBasicData>(this.specialMemberUrl, form);
  }

  updateSpecialMember(form: SpecialMemberForm, id: number) {
    return this.http.put<SpecialMemberDetail>(`${this.specialMemberUrl}/${id}`, form);
  }
}
