import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "../auth/services/auth.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private hasNotificationsSubject: BehaviorSubject<boolean>;
  public userHasNotifications$: Observable<boolean>;

  constructor() {
    this.hasNotificationsSubject = new BehaviorSubject<boolean>(false);
    this.userHasNotifications$ = this.hasNotificationsSubject.asObservable();
  }

  public checkIfHasNotifications() {
    if (this.authService.hasRequiredPermission(["ROLE_USER"])) {
      this.getNotificationInfo().subscribe(result => {
        this.hasNotificationsSubject.next(result);
      });
    }
  }

  public userHasNoNotifications() {
    this.hasNotificationsSubject.next(false);
  }

  private getNotificationInfo() {
    return this.http.get<boolean>(`${environment.apiUrl}/confirmation/notification`);
  }
}
