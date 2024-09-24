import {Contact} from "./contact.model";

export interface Scout {
  id?: number;
  name: string;
  surname: string;
  dni?: string;
  birthday: Date;
  groupId: number;
  medicalData: string;
  contactList: Contact[];
  gender: string;
  imageAuthorization: boolean;
  shirtSize?: string;
  municipality?: string;
  census?: number;
  progressions?: string;
  observations?: string;
  enabled?: boolean;
  userAssigned?: boolean;
}
