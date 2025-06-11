export interface Role {
  id: string;
  name: UserRole;
}

export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  SCOUTER = "ROLE_SCOUTER",
  USER = "ROLE_USER",
  EDITOR = "ROLE_EDITOR",
  TRANSACTION = "ROLE_TRANSACTION",
  GROUP_SCOUTER = "ROLE_GROUP_SCOUTER",
  FORM = "ROLE_FORM",
  SCOUT_CENTER_REQUESTER = "ROLE_SCOUT_CENTER_REQUESTER",
  SCOUT_CENTER_MANAGER = "ROLE_SCOUT_CENTER_MANAGER",
  SECRETARY = "ROLE_SECRETARY"
}

//ordered by role pipe name
export const roles: Role[] = [
  {id: "1", name: UserRole.ADMIN},
  {id: "4", name: UserRole.EDITOR},
  {id: "9", name: UserRole.SCOUT_CENTER_MANAGER},
  {id: "7", name: UserRole.FORM},
  {id: "2", name: UserRole.SCOUTER},
  {id: "6", name: UserRole.GROUP_SCOUTER},
  {id: "8", name: UserRole.SCOUT_CENTER_REQUESTER},
  {id: "5", name: UserRole.TRANSACTION},
  {id: "3", name: UserRole.USER},
  {id: "10", name: UserRole.SECRETARY}
];
