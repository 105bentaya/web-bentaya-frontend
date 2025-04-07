import {Status} from "../constant/status.constant";
import {BasicScoutCenter} from "./booking.model";

export interface BookingCalendarInfo {
  startDate: Date;
  endDate: Date;
  status: Status;
  fullyOccupied?: boolean;
  id: number;
  packs: number;
  scoutCenter?: BasicScoutCenter
}
