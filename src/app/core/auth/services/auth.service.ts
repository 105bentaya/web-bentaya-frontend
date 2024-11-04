import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {find} from 'lodash';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Credentials} from '../credentials.model';
import {LoggedUserInformationService} from './logged-user-information.service';
import {TokenService} from './token.service';
import {User} from "../../../features/users/models/user.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //todo big rework

  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  private readonly isLoggedInSubject: BehaviorSubject<boolean>;
  public readonly isLoggedIn$: Observable<boolean>;
  private readonly loggedUserSubject: BehaviorSubject<User>;
  public readonly loggedUser$: Observable<User>;

  constructor() {
    const token = !!this.tokenService.getToken();
    this.isLoggedInSubject = new BehaviorSubject<boolean>(token);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    this.loggedUserSubject = new BehaviorSubject(LoggedUserInformationService.getUserInformation());
    this.loggedUser$ = this.loggedUserSubject.asObservable();
  }

  public getAuthHeader() {
    return `Bearer ${this.tokenService.getToken()}`;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  login(credentials: Credentials) {
    return this.http.post(`${environment.apiUrl}/login`, credentials, {observe: "response"}).pipe(
      tap(response => this.postLogin(response))
    );
  }

  private postLogin(response: any) {
    this.isLoggedInSubject.next(true);
    this.tokenService.saveToken(response.headers.get("Authorization").split(" ")[1]);
    return this.loadUserInfo();
  }

  logout() {
    this.tokenService.removeToken();
    LoggedUserInformationService.removeUserInformation();
    this.isLoggedInSubject.next(false);
  }

  hasRequiredPermission(requiredPermissions: Array<any>) {
    const loggedUser = LoggedUserInformationService.getUserInformation();
    return (
      loggedUser &&
      find(
        requiredPermissions,
        role => loggedUser.roles.indexOf(role) !== -1
      )
    );
  }

  loadUserInfo() {
    return this.getUserInfo().subscribe(userData => {
      LoggedUserInformationService.saveUserInformation(userData);
      this.loggedUserSubject.next(userData);
    });
  }

  private getUserInfo() {
    return this.http.get<User>(`${environment.apiUrl}/user/me`);
  }

}
