import {Injectable} from '@angular/core';
import {filter, ReplaySubject, Subject} from 'rxjs';
import {AlertMessage} from '../model/alert-message.model';
import {identity} from "lodash";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly alertObservable: Subject<AlertMessage | undefined> = new ReplaySubject(1);

  getObservable = () => {
    return this.alertObservable.asObservable().pipe(filter(identity));
  };

  sendMessage = (message: AlertMessage) => {
    this.alertObservable.next(message);
  };

  sendBasicErrorMessage(message: string, title = "Error") {
    this.sendMessage({
      title: title,
      message: message,
      severity: "error"
    });
  }

  sendBasicSuccessMessage(message: string) {
    this.sendMessage({
      title: "Éxito",
      message: message,
      severity: "success"
    });
  }
}
