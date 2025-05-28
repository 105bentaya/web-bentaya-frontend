import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface Scout {
  id: number;
  roleInfos: SpecialMember[];
  observations?: string;
  extraFiles: ScoutFile[];
  images: ScoutFile[];
  personalData: PersonalData;
  scoutInfo: ScoutInfo;
}

export interface ScoutRecord {
  id: number;
  recordType: string;
  startDate: Date;
  endDate: Date;
  observations: string;
  files: ScoutFile[];
}

export interface ScoutInfo {
  scoutType: ScoutType;
  registrationDates: RegistrationDate[];
  active: boolean;
  federated: boolean;
  census?: number;
  section: string;
  imageAuthorization: boolean;
  group?: BasicGroupInfo;
  contactList: ScoutContact[];
  medicalData: ScoutMedicalData;
  recordList: ScoutRecord[]
}

export interface RegistrationDate {
  id?: number;
  registrationDate: Date;
  unregistrationDate?: Date;
}

export interface ScoutMedicalData {
  bloodType: BloodType;
  socialSecurityNumber?: string;
  socialSecurityHolder?: InsuranceHolder;
  privateInsuranceNumber?: string;
  privateInsuranceEntity?: string;
  privateInsuranceHolder?: InsuranceHolder;
  foodIntolerances?: string;
  foodAllergies?: string;
  foodProblems?: string;
  foodDiet?: string;
  foodMedication?: string;
  medicalIntolerances?: string;
  medicalAllergies?: string;
  medicalDiagnoses?: string;
  medicalPrecautions?: string;
  medicalMedications?: string;
  medicalEmergencies?: string;
  addictions?: string;
  tendencies?: string;
  records?: string;
  bullyingProtocol?: string;
  documents: ScoutFile[];
}

export interface InsuranceHolder {
  contact?: ScoutContact;
  name?: string;
  surname?: string;
  idDocument?: IdentificationDocument;
  phone?: string;
  email?: string;
}

export interface ScoutContact {
  id: number;
  personType: PersonType;
  companyName?: string;
  name: string;
  surname?: string;
  relationship?: string;
  donor: boolean;
  idDocument?: IdentificationDocument;
  phone?: string;
  email?: string;
  studies?: string;
  profession?: string;
  observations?: string;
}

export interface SpecialMember {
  id: number;
  role: MemberRole;
  date: Date;
  roleCensus: number;
  reason?: string;
  observations?: string;
}

export interface ScoutFile {
  id: number;
  uuid: string;
  name: string;
  mimeType: string;
  customName?: string;
  uploadDate: Date;
}

export interface PersonalData {
  name: string;
  surname: string;
  feltName?: string;
  gender: string;
  birthday: Date;
  idDocument?: IdentificationDocument;
  birthplace: string;
  birthProvince: string;
  nationality: string;
  address: string;
  city: string;
  province: string;
  residenceMunicipality: string;
  phone: string;
  landline: string;
  email: string;
  shirtSize: string;
  observations: string;
  documents: ScoutFile[];
}

export interface IdentificationDocument {
  idType: IdType;
  number: string;
}

export type PersonType = "REAL" | "JURIDICAL";
export type MemberRole = "FOUNDER" | "HONOUR" | "RECOGNIZED" | "PROTECTOR";
export type IdType = "DNI" | "NIE" | "CIF" | "PAS" | "OTR";
export type ScoutType = "SCOUT" | "SCOUTER" | "COMMITTEE" | "MANAGER" | "INACTIVE";
export type BloodType =
  "O_POSITIVE"
  | "O_NEGATIVE"
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "NA";

