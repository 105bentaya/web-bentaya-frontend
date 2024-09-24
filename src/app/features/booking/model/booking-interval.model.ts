import {Status} from "../constant/status.constant";

export interface BookingInterval {
  startDate: Date;
  endDate: Date;
  status: Status;
}
