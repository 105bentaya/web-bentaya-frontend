import {UserProfile} from "../../../features/users/models/user-profile.model";

export class UserDataStorageHelper {
  static saveUserInformation(user: UserProfile) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static getUserInformation(): UserProfile {
    return JSON.parse(localStorage.getItem("user")!);
  }

  static removeUserInformation() {
    localStorage.removeItem("user");
  }

  static saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static removeToken() {
    localStorage.removeItem("token");
  }
}
