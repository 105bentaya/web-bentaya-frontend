export interface PreScoutForm {
  name: string;
  firstSurname: string;
  secondSurname?: string;
  birthday: string;
  gender: string;
  dni: string;
  size: string;
  medicalData: string;
  hasBeenInGroup: boolean;
  yearAndSection?: string;
  parentsName?: string;
  parentsFirstSurname: string;
  parentsSecondSurname?: string;
  relationship: string;
  phone: string;
  email: string;
  comment: string;
  priority: number;
  priorityInfo?: string;
}
