import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface Member {
  id: number;
  type: MemberType;
  roleInfos: MemberRoleInfo[];
  observations?: string;
  extraFiles: MemberFile[];
  images: MemberFile[];
  personalData: RealPersonalData | JuridicalPersonalData;
  scoutInfo?: ScoutInfo;
}

export interface ScoutInfo {
  scoutType: ScoutType;
  registrationDates: { registrationDate: Date; unregistrationDate?: Date }[];
  active: boolean;
  federated: boolean;
  census: number;
  imageAuthorization: boolean;
  group?: BasicGroupInfo;
  photo?: MemberFile;
}

export interface MemberRoleInfo {
  id: number;
  role: MemberRole;
  date: Date;
  roleCensus: number;
  reason?: string;
  observations?: string;
}

export interface MemberFile {
  id: number;
  uuid: string;
  name: string;
  mimeType: string;
  customName?: string;
  uploadDate: Date;
}

export interface RealPersonalData {
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
  documents: MemberFile[];
}

export interface JuridicalPersonalData {
  idDocument: IdentificationDocument;
  representative: JuridicalRepresentative;
  companyName: string;
  observations: string;
  documents: MemberFile[];
}

export interface JuridicalRepresentative {
  id: number;
  idDocument: IdentificationDocument;
  name: string;
  surname: string;
  email: string;
  phone: string;
  landline: string;
}

export interface IdentificationDocument {
  idType: IdType;
  number: string;
}

export type MemberType = "REAL" | "JURIDICAL";
export type MemberRole = "FOUNDER" | "HONOUR" | "RECOGNIZED" | "PROTECTOR";
export type IdType = "DNI" | "NIE" | "CIF" | "PAS" | "OTR";
export type ScoutType = "PARTICIPANT" | "SCOUT" | "COMMITTEE";
