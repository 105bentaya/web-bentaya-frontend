import {BloodType, EconomicEntryDonor, IdentificationDocument, ScoutType} from "./scout.model";

export interface NewScoutForm {
  iban?: string;
  bank?: string;
  scoutType: ScoutType;
  groupId?: number;
  census?: number;
  firstActivityDate: Date | string;
  imageAuthorization: boolean;
  contact?: ScoutContactForm;
  name: string;
  feltName?: string;
  surname: string;
  birthday: Date | string;
  gender: string;
  idDocument?: IdentificationDocument;
  shirtSize?: string;
  address?: string;
  city?: string;
  province?: string;
  residenceMunicipality?: string;
  phone?: string;
  landline?: string;
  email?: string;
  scoutUsers: string[];
  preScoutId?: number;
  hasBeenBefore: boolean;
}

export interface PersonalDataForm {
  idDocument?: IdentificationDocument;
  observations?: string;
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
  imageAuthorization: boolean;
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

export interface ScoutMedicalForm {
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
  bloodType: BloodType;
  socialSecurityNumber?: string;
  socialSecurityHolder?: InsuranceHolderForm;
  privateInsuranceNumber?: string;
  privateInsuranceEntity?: string;
  privateInsuranceHolder?: InsuranceHolderForm;
}

export interface InsuranceHolderForm {
  contactId?: number;
  name?: string;
  surname?: string;
  idDocument?: IdentificationDocument;
  phone?: string;
  email?: string;
}

export interface ScoutInfoForm {
  scoutType: ScoutType;
  groupId?: number;
  registrationDates: RegistrationDateForm[];
  federated: boolean;
  census?: number;
}

export interface EconomicDataForm {
  iban: string;
  bank: string;
  donorId?: number;
}

export interface EconomicEntryForm {
  issueDate: Date | string;
  dueDate: Date | string;
  description: string;
  amount: number;
  incomeId?: number;
  expenseId?: number;
  account?: string;
  type: string;
  observations?: string;
  donor?: EconomicEntryDonor
}

export interface RegistrationDateForm {
  id?: number;
  registrationDate: Date | string;
  unregistrationDate?: Date | string;
}

export interface ScoutHistoryForm {
  progressions?: string;
  observations?: string;
}
