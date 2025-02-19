import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';
import {Credentials} from '../credentials.model';
import {environment} from "../../../../environments/environment";
import {LoggedUserDataService} from "./logged-user-data.service";
import {UserProfile} from "../user-profile.model";
import {UserDataStorageHelper} from "./user-data-storage.helper";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly userDataService = inject(LoggedUserDataService);

  private readonly isLoggedInSubject: BehaviorSubject<boolean>;
  public readonly isLoggedIn$: Observable<boolean>;
  public static readonly userInfoUrl = `${environment.apiUrl}/user/me`;

  constructor() {
    const isLoggedIn = !!UserDataStorageHelper.getToken();
    if (!isLoggedIn) UserDataStorageHelper.removeUserInformation();
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!UserDataStorageHelper.getToken());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  public getAuthHeader() {
    return `Bearer ${UserDataStorageHelper.getToken()}`;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  public login(credentials: Credentials): Observable<void> {
    return this.http.post(`${environment.apiUrl}/login`, credentials, {observe: "response"}).pipe(
      switchMap(response => this.postLogin(response))
    );
  }

  private postLogin(response: any) {
    this.isLoggedInSubject.next(true);
    UserDataStorageHelper.saveToken(response.headers.get("Authorization").split(" ")[1]);
    return this.loadUserInfo();
  }

  public logout() {
    UserDataStorageHelper.removeToken();
    UserDataStorageHelper.removeUserInformation();
    this.isLoggedInSubject.next(false);
  }

  public loadUserInfo() {
    return this.getUserInfo().pipe(
      map(userData => this.userDataService.saveInfo(userData))
    );
  }

  private getUserInfo() {
    return this.http.get<UserProfile>(AuthService.userInfoUrl);
  }
}

