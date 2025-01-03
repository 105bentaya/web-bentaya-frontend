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
  status?: number
  groupId?: number
  assignationComment?: string;
  assignationDate?: Date;
  size?: string;
  inscriptionYear?: number;
}
