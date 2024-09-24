import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AlertMessage} from '../model/alert-message.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertObservable: Subject<AlertMessage> = new Subject();

  getObservable = () => {
    return this.alertObservable.asObservable();
  };

  sendMessage = (message: AlertMessage) => {
    this.alertObservable.next(message);
  };

  sendBasicErrorMessage(message: string) {
    this.sendMessage({
      title: "Error",
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
