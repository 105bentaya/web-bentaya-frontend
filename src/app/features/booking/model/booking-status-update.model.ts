import {Status} from "../constant/status.constant";

export interface BookingStatusUpdate {
  id: number;
  newStatus: Status;
  observations: string;
  price?: number;
}
