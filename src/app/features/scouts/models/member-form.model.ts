import {IdentificationDocument, MemberType} from "./member.model";

export interface PersonalDataForm {
  type: MemberType;
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
