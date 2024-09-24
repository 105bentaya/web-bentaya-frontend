export const groups = [
  {name: "GRUPO", id: 0},
  {name: "GARAJONAY", id: 1},
  {name: "WAIGUNGA", id: 2},
  {name: "BAOBAB", id: 3},
  {name: "AUTINDANA", id: 4},
  {name: "ARTETEIFAC", id: 5},
  {name: "ARIDANE", id: 6},
  {name: "IDAFE", id: 7},
  {name: "SCOUTERS", id: 8}
];

export const unitGroups = [
  {name: "GARAJONAY", id: 1},
  {name: "WAIGUNGA", id: 2},
  {name: "BAOBAB", id: 3},
  {name: "AUTINDANA", id: 4},
  {name: "ARTETEIFAC", id: 5},
  {name: "ARIDANE", id: 6},
  {name: "IDAFE", id: 7}
];

export function isNoAttendanceGroup(groupId: number): boolean {
  return groupId == 0 || groupId == 8;
}

export function getGeneralGroups(): { name: string, id: number }[] {
  return [{name: "GRUPO", id: 0}, {name: "SCOUTERS", id: 8}];
}
