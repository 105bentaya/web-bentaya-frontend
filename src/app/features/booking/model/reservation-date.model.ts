import {Status} from "../constant/status.constant";

export interface ReservationDate {
  startDate: Date;
  endDate: Date;
  status: Status;
}
