import {Role} from "./role.model";
import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface User {
  id?: string;
  username: string;
  password: string;
  enabled: boolean;
  roles: Role[];
  scoutList?: UserScout[];
  groupName?: string;
}

export interface UserScout {
  id: number;
  group: BasicGroupInfo;
  name: string;
  surname: string;
}
