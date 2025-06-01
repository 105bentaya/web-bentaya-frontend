import {Role} from "./role.model";
import {UserScout} from "../../scouts/models/scout.model";

export interface User {
  id?: string;
  username: string;
  password: string;
  enabled: boolean;
  roles: Role[];
  scoutList?: UserScout[];
  groupName?: string;
}
