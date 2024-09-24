import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {ForgotPassword} from "../../reset-password/forgot-password.model";
import {Page} from "../../../shared/model/page.model";
import {environment} from "../../../../environments/environment";
import {Filter} from "../../../shared/model/filter.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private userUrl = `${environment.apiUrl}/user`;

  getAll(filter: Filter): Observable<Page<User>> {
    return this.http.get<Page<User>>(this.userUrl, {
      params: new HttpParams({fromObject: filter})
    });
  }

  findById(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  save(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user);
  }

  update(user: User, id: string): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${id}`, user);
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
