import {Status} from "../constant/status.constant";

export interface BookingUpdateStatus {
  id: number;
  newStatus: Status;
  observations: string;
  price?: number;
}
