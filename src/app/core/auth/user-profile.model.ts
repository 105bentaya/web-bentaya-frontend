import {UserRole} from "../../features/users/models/role.model";

export interface UserProfile {
  id: number;
  username: string;
  roles: UserRole[];
  groupId: number;
  scoutList: UserScout[];
}

export interface UserScout {
  id: number;
  groupId: number;
  name: string;
  surname: string;
}
