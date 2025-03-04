import {Injectable} from '@angular/core';
import {UserDataStorageHelper} from "./user-data-storage.helper";
import {UserProfile, UserScout} from "../user-profile.model";
import {find, uniq} from "lodash";
import {UserRole} from "../../../features/users/models/role.model";

@Injectable({
  providedIn: 'root'
})
export class LoggedUserDataService {

  public hasRequiredPermission(...requiredPermissions: Array<UserRole>): boolean {
    const loggedUserRoles = this.userProfile?.roles;
    return (
      loggedUserRoles &&
      !!find(
        requiredPermissions.flat(),
        role => loggedUserRoles.indexOf(role) !== -1
      )
    );
  }

  getGroupId(): number {
    return this.userProfile.groupId;
  }

  getUsername(): string {
    return this.userProfile.username;
  }

  getScoutGroupIds() {
    return uniq(this.userProfile.scoutList.map(scout => scout.groupId));
  }

  getScouts(): UserScout[] {
    return this.userProfile.scoutList;
  }

  saveInfo(userData: UserProfile) {
    UserDataStorageHelper.saveUserInformation(userData);
  }

  private get userProfile(): UserProfile {
    return UserDataStorageHelper.getUserInformation();
  }
}
