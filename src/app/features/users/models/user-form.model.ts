import {UserRole} from "./role.model";

export interface UserForm {
  id?: number;
  username: string;
  password: string;
  enabled: boolean;
  roles: UserRole[];
  scoutIds?: number[];
  scouterId?: number;
}
