export interface Setting {
  name: SettingType;
  value: string;
  type: valueType;
}

export enum SettingType {
  CURRENT_FORM_YEAR = "CURRENT_FORM_YEAR",
  FORM_IS_OPEN = "FORM_IS_OPEN",
  CURRENT_YEAR = "CURRENT_YEAR",
  MAINTENANCE = "MAINTENANCE",
  BOOKING_MAIL = "BOOKING_MAIL",
  CONTACT_MAIL = "CONTACT_MAIL",
  COMPLAINT_MAIL = "COMPLAINT_MAIL",
  FORM_MAIL = "FORM_MAIL",
  TREASURY_MAIL = "TREASURY_MAIL",
  ADMINISTRATION_MAIL = "ADMINISTRATION_MAIL",
  BOOKING_DATE = "BOOKING_DATE",
  BOOKING_MIN_DAY_NUMBER = "BOOKING_MIN_DAY_NUMBER",
  BOOKING_MAX_DAY_NUMBER = "BOOKING_MAX_DAY_NUMBER"
}

type valueType = "BOOLEAN" | "STRING" | "NUMBER" | "DATE";

export type settingFormType = {
  [key in SettingType]: {
    originalValue: any,
    currentValue: any,
    valueType: valueType,
    invalid?: boolean
  }
};
