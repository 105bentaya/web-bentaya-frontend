export interface UserForm {
  id?: string;
  username: string;
  password: string;
  enabled: boolean;
  roles: string[];
  scoutIds?: number[];
  groupId?: number;
}
