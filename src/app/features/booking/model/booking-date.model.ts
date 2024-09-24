import {Status} from "../constant/status.constant";

export interface BookingDate {
  startDate: Date;
  endDate: Date;
  status: Status;
  id: number;
  packs: number;
}
