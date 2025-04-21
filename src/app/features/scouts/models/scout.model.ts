import {Contact} from "./contact.model";
import {BasicGroupForm, BasicGroupInfo} from "../../../shared/model/group.model";

export interface Scout {
  id?: number;
  name: string;
  surname: string;
  dni?: string;
  birthday: Date | string; //create scout form dto
  group: BasicGroupInfo | BasicGroupForm; //todo maybe create different form object
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
