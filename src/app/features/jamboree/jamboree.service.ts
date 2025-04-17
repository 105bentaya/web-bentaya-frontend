import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {JamboreeForm} from "./jamboree-form.model";

@Injectable({
  providedIn: 'root'
})
export class JamboreeService {

  private readonly http = inject(HttpClient);
  private readonly jamboreeUrl = `${environment.apiUrl}/jamboree`;

  saveForm(form: JamboreeForm) {
    return this.http.post(`${this.jamboreeUrl}/public/form`, form);
  }
}
