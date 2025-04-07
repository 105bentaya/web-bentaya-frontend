import {BookingInfo} from "./booking-info.model";

export interface PendingBookings {
  newBookings: BookingInfo[];
  acceptedBookings: BookingInfo[];
  confirmedBookings: BookingInfo[];
  finishedBookings: BookingInfo[];
}
