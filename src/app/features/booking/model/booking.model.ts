import {Status} from "../constant/status.constant";

export interface Booking {
  organizationName: string;
  cif: string;
  facilityUse: string;
  contactName: string;
  contactRelationship: string;
  contactMail: string;
  contactPhone: string;
  packs: number;
  scoutCenter: BasicScoutCenter;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  status: Status;
  id: number;
  observations: string;
  statusObservations: string;
  exclusiveReservation: boolean;
  ownBooking: boolean;
  userConfirmedDocuments: boolean;
  price: number;
  minutes: number;
  billableDays: number;
}

export interface BasicScoutCenter {
  id: number;
  name: string;
  maxCapacity: number;
  minExclusiveCapacity: number;
  price: number
}

export function bookingIsAlwaysExclusive(booking: Booking) {
  return centerIsAlwaysExclusive(booking.scoutCenter);
}

export function centerIsAlwaysExclusive(center: BasicScoutCenter) {
  return center.minExclusiveCapacity < 1;
}
