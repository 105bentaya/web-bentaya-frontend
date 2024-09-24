import {Injectable} from "@angular/core";
import {User} from "../../../features/users/models/user.model";

@Injectable({
  providedIn: "root"
})
export class LoggedUserInformationService {
  constructor() {
  }

  static saveUserInformation(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static removeUserInformation() {
    localStorage.removeItem("user");
  }

  static getUserInformation(): User {
    return JSON.parse(localStorage.getItem("user")!);
  }
}
