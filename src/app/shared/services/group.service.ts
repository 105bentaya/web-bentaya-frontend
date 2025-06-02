import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable, shareReplay} from "rxjs";
import {BasicGroupInfo} from "../model/group.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/group`;
  private readonly data$: Observable<BasicGroupInfo[]> = this.http.get<BasicGroupInfo[]>(this.url).pipe(shareReplay(1));
  public static readonly generalGroup: BasicGroupInfo = {id: 0, name: "Grupo", order: 0};
  public static readonly allGroups: BasicGroupInfo[] = [
    {id: -1, name: "Kraal", order: 100},
    {id: -2, name: "Almogaren", order: 101},
    {id: -3, name: "Tagoror", order: 102},
    {id: -4, name: "Guatatiboa", order: 103},
  ];

  getBasicGroups(options?: {
    uppercase?: boolean,
    generalGroup?: boolean,
    allGroups?: boolean
  }): Observable<BasicGroupInfo[]> {
    let data = this.data$;

    if (options?.generalGroup) {
      data = data.pipe(map(groups => {
        return [
          GroupService.generalGroup,
          ...groups
        ];
      }));
    }

    if (options?.allGroups) {
      data = data.pipe(map(groups => {
        return [
          ...groups,
          ...GroupService.allGroups
        ];
      }));
    }

    if (options?.uppercase) {
      data = data.pipe(map(groups => groups.map(group => ({
        ...group,
        name: group.name.toUpperCase()
      }))));
    }

    return data;
  }
}
