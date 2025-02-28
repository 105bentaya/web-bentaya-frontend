import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {WindowUtils} from "../../shared/util/window-utils";

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  protected _expanded = JSON.parse(localStorage.getItem("uhe") ?? 'true') && !WindowUtils.windowSmallerLG();
  private readonly expanded$ = new BehaviorSubject<boolean>(this._expanded);

  constructor() {
    localStorage.setItem("uhe", JSON.stringify(this._expanded));
  }

  get expanded(): Observable<boolean> {
    return this.expanded$.asObservable();
  };
  get currentExpanded(): boolean {
    return this._expanded;
  };

  invertExpanded() {
    this._expanded = !this._expanded;
    localStorage.setItem("uhe", JSON.stringify(this._expanded));
    this.expanded$.next(this._expanded);
  }
}
