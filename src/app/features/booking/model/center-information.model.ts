import {ScoutCenter} from "../constant/scout-center.constant";

export interface CenterInformation {
  center: ScoutCenter;
  maxCapacity: number;
  rules: string;
  incidentsRegister: string;
  exclusiveReservationCapacity: number;
  title: string;
  description: string;
  listInfo: string[];
  images: string[];
}
