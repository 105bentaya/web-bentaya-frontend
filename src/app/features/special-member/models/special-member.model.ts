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
  donations: SpecialMemberDonation[];
}

export interface SpecialMemberBasicData {
  id: number;
  role: SpecialMemberRole;
  roleCensus: number;
  name: string;
}

export interface SpecialMemberDetail {
  person: SpecialMemberPerson;
  records: SpecialMemberDetailRecord[]
}

export interface SpecialMemberDetailRecord {
  id: number;
  role: SpecialMemberRole;
  roleCensus: number;
  awardDate?: Date;
  agreementDate?: Date;
  details?: string;
  observations?: string;
  donations: SpecialMemberDonation[];
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

export interface SpecialMemberDonation {
  id: number;
  date: Date;
  type: DonationType;
  inKindDonationType?: string;
  amount?: number;
  paymentType?: string;
  bankAccount?: string;
  notes?: string;
}

export interface FilterResult {
  label: string;
  id: number;
}

export type SpecialMemberRole = "FOUNDER" | "HONOUR" | "ACKNOWLEDGEMENT" | "PROTECTOR" | "DONOR";
export type DonationType = "ECONOMIC" | "IN_KIND";

export const specialMemberOptions: { label: string; value: SpecialMemberRole }[] = [
  {label: 'Asociada de Honor', value: 'HONOUR'},
  {label: 'Asociada Protectora', value: 'PROTECTOR'},
  {label: 'Asociada Fundadora', value: 'FOUNDER'},
  {label: 'Reconocimiento', value: 'ACKNOWLEDGEMENT'},
  {label: 'Donante', value: "DONOR"}
];
