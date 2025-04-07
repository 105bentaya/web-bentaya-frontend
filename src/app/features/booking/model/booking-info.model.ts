import {Status} from "../constant/status.constant";
import {BasicScoutCenter} from "./booking.model";

export interface BookingInfo {
  id: number;
  ownBooking: boolean;
  status: Status;
  scoutCenter: BasicScoutCenter;
  startDate: Date;
  endDate: Date;
  packs: number;
  organizationName?: string;
  cif?: string;
}
