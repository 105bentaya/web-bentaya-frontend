import {IdentificationDocument, PersonType} from "../../scouts/models/member.model";

export interface SpecialMember {
  id: number;
  role: SpecialMemberRole;
  roleCensus: number;
  awardDate?: Date;
  agreementDate?: Date;
  details?: string;
  observations?: string;
  person: SpecialMemberPerson;
}

export interface SpecialMemberBasicData {
  id: number;
  role: SpecialMemberRole;
  roleCensus: number;
  name: string;
}

export interface SpecialMemberDetail {
  person: SpecialMemberPerson;
  records: SpecialMemberDetailDetail[]
}

export interface SpecialMemberDetailDetail {
  id: number;
  role: SpecialMemberRole;
  roleCensus: number;
  awardDate?: Date;
  agreementDate?: Date;
  details?: string;
  observations?: string;
}

export interface SpecialMemberPerson {
  scoutId?: number;
  personId?: number;
  type: PersonType;
  name: string;
  surname: string;
  companyName: string;
  idDocument: IdentificationDocument;
  phone?: string;
  email?: string;
}

export interface FilterResult {
  label: string;
  id: number;
}

export type SpecialMemberRole = "FOUNDER" | "HONOUR" | "ACKNOWLEDGEMENT" | "PROTECTOR" | "DONOR";

export const specialMemberOptions: { label: string; value: SpecialMemberRole }[] = [
  {label: 'Asociada de Honor', value: 'HONOUR'},
  {label: 'Asociada Protectora', value: 'PROTECTOR'},
  {label: 'Asociada Fundadora', value: 'FOUNDER'},
  {label: 'Reconocimiento', value: 'ACKNOWLEDGEMENT'},
  {label: 'Donante', value: "DONOR"}
];
