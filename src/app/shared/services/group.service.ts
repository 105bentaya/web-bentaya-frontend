import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {BasicGroupInfo} from "../model/group.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/group`;

  getAll(): Observable<BasicGroupInfo[]> {
    return this.http.get<BasicGroupInfo[]>(this.url);
  }

  getAllUppercase(): Observable<BasicGroupInfo[]> {
    return this.http.get<BasicGroupInfo[]>(this.url).pipe(map(groups => groups.map(group => ({
      ...group,
      name: group.name.toUpperCase()
    }))));
  }
}
