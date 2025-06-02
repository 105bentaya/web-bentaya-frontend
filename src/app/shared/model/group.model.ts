export interface BasicGroupInfo {
  id: number;
  name: string;
  order: number;
  section?: Section;
}

export interface BasicGroupForm {
  id: number;
  name?: string;
  order?: number;
}

export type Section = "CASTORES" | "LOBATOS" | "SCOUTS" | "ESCULTAS" | "ROVERS" | "SCOUTERS" | "SCOUTSUPPORT";
