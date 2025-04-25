import {IdentificationDocument, PersonType} from "./member.model";

export interface PersonalDataForm {
  type: PersonType;
  idDocument?: IdentificationDocument;
  observations?: string;
  realData?: {
    surname: string;
    name: string;
    feltName?: string;
    birthday: Date | string;
    birthplace?: string;
    birthProvince?: string;
    nationality?: string;
    address?: string;
    city?: string;
    province?: string;
    phone?: string;
    landline?: string;
    email?: string;
    shirtSize?: string;
    residenceMunicipality?: string;
    gender?: string;
  };
  juridicalData?: {
    name: string;
    surname?: string;
    email?: string;
    phone?: string;
    landline?: string;
    idDocument?: IdentificationDocument
  };
}

export interface ScoutContactForm {
  id?: number;
  personType: string;
  companyName?: string;
  name: string;
  surname?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  studies?: string;
  profession?: string;
  observations?: string;
  idDocument?: IdentificationDocument;
  donor: boolean;
}
