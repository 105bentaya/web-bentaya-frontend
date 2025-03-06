import {PreScoutAssignation} from "./pre-scout-assignation.model";

export interface PreScout {
  id?: number;
  name: string;
  surname: string;
  birthday: string;
  section?: string;
  gender: string;
  dni?: string;
  hasBeenInGroup?: boolean;
  yearAndSection?: string;
  medicalData?: string;
  parentsName?: string;
  parentsSurname?: string;
  relationship?: string;
  phone: string;
  email: string;
  comment: string;
  priority: number;
  priorityInfo?: string;
  creationDate?: Date;
  age?: string;
  assignation?: PreScoutAssignation;
  size?: string;
  inscriptionYear?: number;
}
