export interface Setting {
  name: SettingType;
  value: string;
}

export enum SettingType {
  CURRENT_FORM_YEAR = "CURRENT_FORM_YEAR",
  FORM_IS_OPEN = "FORM_IS_OPEN",
  CURRENT_YEAR = "CURRENT_YEAR",
  MAINTENANCE = "MAINTENANCE"
}
