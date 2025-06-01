import {IdType, PersonType} from "../features/scouts/models/scout.model";

export const socialMediaButtons = [
  {icon: 'pi pi-instagram ', link: 'https://www.instagram.com/scouts105bentaya'},
  {icon: 'pi pi-facebook', link: 'https://www.facebook.com/scouts105bentaya'},
  {icon: 'pi pi-youtube', link: 'https://www.youtube.com/channel/UCKWYNHkToxg5Vkkfv8u3-yg'},
  {icon: 'pi pi-tiktok', link: 'https://www.tiktok.com/@scouts105bentaya'},
  {icon: 'fa-brands fa-twitter', link: 'https://twitter.com/scout105bentaya'},
];

export const sections = [
  "CASTOR", "LOBATO", "SCOUT", "ESCULTA", "ROVER" //todo cambiar a colonia, manadas, scout, unidad, clan?
];

export const genders = ["Masculino", "Femenino", "No Binario", "Otro"];
export const shirtSizes: string[] = ["5/6", "7/8", "9/10", "11/12", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
export const idTypes: { value: IdType, label: string }[] = [
  {value: "DNI", label: "DNI"},
  {value: "CIF", label: "CIF"},
  {value: "NIE", label: "NIE"},
  {value: "PAS", label: "Pasaporte"},
  {value: "OTR", label: "Otro"}
];
export const personTypes: ({ label: string; value: PersonType })[] = [
  {label: "Real", value: "REAL"},
  {label: "Jurídica", value: "JURIDICAL"}
];

export const maintenanceEmail = "informatica@105bentaya.org";
export const generalEmail = "scouts@105bentaya.org";
export const moneyEmail = "tesoreria@105bentaya.org";
export const presidencyEmail = "presidencia@105bentaya.org";
export const viceEmail = "vicepresidencia@105bentaya.org";
export const secretaryEmail = "secretaria@105bentaya.org";
export const bookingEmail = "centroscouts@105bentaya.org";

export const maxFileUploadByteSize = 100 * 1024 * 1024 - 500;


export const yesNoOptions = [{label: 'Sí', value: true}, {label: 'No', value: false}];
