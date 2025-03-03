import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Complaint} from "../../features/comunica/models/complaint.model";
import {ContactMessage} from "../../features/comunica/models/contactMessage.model";
import {Partnership} from "../../features/colaboraciones/model/partnership.model";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly http = inject(HttpClient);

  sendComplaintMail(complaint: Complaint): Observable<Complaint> {
    return this.http.post<Complaint>(environment.apiUrl + "/complaint/form", complaint);
  }

  sendContactMessageMail(contactMessage: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(environment.apiUrl + "/contact-message/form", contactMessage);
  }

  sendPartnershipMail(partnership: Partnership): Observable<Partnership> {
    return this.http.post<Partnership>(environment.apiUrl + "/partnership/form", partnership);
  }
}
