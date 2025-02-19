export interface UserProfile {
  id: number;
  username: string;
  roles: string[];
  groupId: number;
  scoutList: UserScout[];
}

export interface UserScout {
  id: number;
  groupId: number;
  name: string;
  surname: string;
}
