import {Status} from "../constant/status.constant";

export interface BookingDateAndStatus {
  startDate: Date;
  endDate: Date;
  status: Status;
  fullyOccupied?: boolean;
}
