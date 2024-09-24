import {ScoutCenter} from "../constant/scout-center.constant";

export interface BookingForm {
  groupName: string;
  cif: string;
  workDescription: string;
  contactName: string;
  relationship: string;
  email: string;
  phone: string;
  packs: number;
  scoutCenter: ScoutCenter;
  startDate: Date | string;
  endDate: Date | string;
  observations: string;
  exclusiveReservation: boolean;
}
