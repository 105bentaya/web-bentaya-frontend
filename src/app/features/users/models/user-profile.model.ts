import {UserRole} from "./role.model";
import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface UserProfile {
  id: number;
  username: string;
  roles: UserRole[];
  scouterGroup?: BasicGroupInfo;
  scoutList: UserScout[];
}

export interface UserScout {
  id: number;
  group: BasicGroupInfo;
  name: string;
  surname: string;
}
