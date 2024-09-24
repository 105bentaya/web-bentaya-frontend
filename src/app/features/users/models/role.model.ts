export interface Role {
  id: string;
  name: string;
}
//ordered by role pipe name
export const roles: Role[] = [
  {id: "1", name: "ROLE_ADMIN"},
  {id: "4", name: "ROLE_EDITOR"},
  {id: "9", name: "ROLE_SCOUT_CENTER_MANAGER"},
  {id: "7", name: "ROLE_FORM"},
  {id: "2", name: "ROLE_SCOUTER"},
  {id: "6", name: "ROLE_GROUP_SCOUTER"},
  {id: "8", name: "ROLE_SCOUT_CENTER_REQUESTER"},
  {id: "5", name: "ROLE_TRANSACTION"},
  {id: "3", name: "ROLE_USER"}
];
