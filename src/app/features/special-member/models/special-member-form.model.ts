import {SpecialMemberRole} from "./special-member.model";
import {IdentificationDocument, PersonType} from "../../scouts/models/member.model";

export interface SpecialMemberForm {
  role: SpecialMemberRole;
  roleCensus: number;
  agreementDate?: Date;
  awardDate?: Date;
  details?: string;
  observations?: string;
  scoutId?: number;
  person?: SpecialMemberPersonForm;
}

export interface SpecialMemberPersonForm {
  id?: number;
  type: PersonType;
  name?: string;
  surname?: string;
  companyName?: string;
  idDocument: IdentificationDocument;
  phone?: string;
  email?: string;
}
