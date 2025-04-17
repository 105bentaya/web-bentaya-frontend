export interface JamboreeForm {
  participantType: string;
  surname: string;
  name: string;
  feltName?: string;
  dni: string;
  passportNumber: string;
  nationality: string;
  birthDate: string | Date;
  gender: string;
  phoneNumber: string;
  email: string;
  resident: boolean;
  municipality?: string;
  bloodType: string;
  medicalData: string;
  medication: string;
  allergies: string;
  vaccineProgram: boolean;
  size: string;
  foodIntolerances: string;
  dietPreference?: string;
  languages: {
    language: string;
    level: string;
  }[];
  mainContact: {
    surname: string;
    name: string;
    mobilePhone: string;
    email: string;
    landlinePhone: string;
    address: string;
    cp: string;
    locality: string;
  };
  secondaryContact: {
    surname: string;
    name: string;
    mobilePhone: string;
    email: string;
  };
}
