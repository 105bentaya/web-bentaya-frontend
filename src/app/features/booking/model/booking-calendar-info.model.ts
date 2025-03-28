import {Status} from "../constant/status.constant";

export interface BookingCalendarInfo {
  startDate: Date;
  endDate: Date;
  status: Status;
  fullyOccupied?: boolean;
  id: number;
  packs: number;
}
