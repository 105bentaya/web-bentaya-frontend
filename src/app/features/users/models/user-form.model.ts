export interface UserForm {
  id?: number;
  username: string;
  password: string;
  enabled: boolean;
  roles: string[];
  scoutIds?: number[];
  groupId?: number;
}
