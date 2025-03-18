import {Booking} from "./booking.model";

export interface PendingBookings {
  newBookings: Booking[];
  acceptedBookings: Booking[];
  confirmedBookings: Booking[];
  finishedBookings: Booking[];
}
