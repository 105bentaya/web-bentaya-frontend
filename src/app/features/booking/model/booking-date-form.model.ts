import {ScoutCenter} from "../constant/scout-center.constant";

export interface BookingDateForm {
  startDate: Date | string;
  endDate: Date | string;
  scoutCenter: ScoutCenter;
}
