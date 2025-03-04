import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {LoggedUserDataService} from "../auth/services/logged-user-data.service";
import {UserRole} from "../../features/users/models/role.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly http = inject(HttpClient);
  private readonly loggedUserData = inject(LoggedUserDataService);

  private readonly hasNotificationsSubject: BehaviorSubject<boolean>;
  public userHasNotifications$: Observable<boolean>;

  constructor() {
    this.hasNotificationsSubject = new BehaviorSubject<boolean>(false);
    this.userHasNotifications$ = this.hasNotificationsSubject.asObservable();
  }

  public checkIfHasNotifications() {
    if (this.loggedUserData.hasRequiredPermission(UserRole.USER)) {
      this.getNotificationInfo().subscribe(result => this.hasNotificationsSubject.next(result));
    }
  }

  public userHasNoNotifications() {
    this.hasNotificationsSubject.next(false);
  }

  private getNotificationInfo() {
    return this.http.get<boolean>(`${environment.apiUrl}/confirmation/notification`);
  }
}
