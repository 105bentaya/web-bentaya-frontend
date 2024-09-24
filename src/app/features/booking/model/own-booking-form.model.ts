import {ScoutCenter} from "../constant/scout-center.constant";

export interface OwnBookingForm {
  id?: number;
  packs: number;
  scoutCenter: ScoutCenter;
  startDate: Date | string;
  endDate: Date | string;
  observations: string;
  exclusiveReservation: boolean;
}
