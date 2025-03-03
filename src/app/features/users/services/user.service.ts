import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {ForgotPassword} from "../../login/components/reset-password/forgot-password.model";
import {Page} from "../../../shared/model/page.model";
import {environment} from "../../../../environments/environment";
import {Filter} from "../../../shared/model/filter.model";
import {UserForm} from "../models/user-form.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);
  private readonly userUrl = `${environment.apiUrl}/user`;

  getAll(filter: Filter): Observable<Page<User>> {
    return this.http.get<Page<User>>(this.userUrl, {
      params: new HttpParams({fromObject: filter})
    });
  }

  findFormById(id: string): Observable<UserForm> {
    return this.http.get<UserForm>(`${this.userUrl}/form/${id}`);
  }

  save(user: UserForm): Observable<UserForm> {
    return this.http.post<UserForm>(this.userUrl, user);
  }

  update(user: UserForm, id: number): Observable<UserForm> {
    return this.http.put<UserForm>(`${this.userUrl}/${id}`, user);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${id}`);
  }

  changePassword(changePasswordDto: any): Observable<void> {
    return this.http.post<void>(`${this.userUrl}/change-password`, changePasswordDto);
  }

  forgotPassword(username: string): Observable<void> {
    return this.http.get<void>(`${this.userUrl}/password/forgot`, {params: {username: username}});
  }

  resetPassword(dto: ForgotPassword): Observable<void> {
    return this.http.post<void>(`${this.userUrl}/password/reset`, dto);
  }
}
