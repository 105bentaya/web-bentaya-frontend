import {Status} from "../constant/status.constant";
import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface Booking {
  id: number;
  status: Status;
  scoutCenter: BasicScoutCenter;
  packs: number;
  startDate: Date;
  endDate: Date;
  observations?: string;
  statusObservations?: string;
  exclusiveReservation: boolean;
  creationDate: Date;
  organizationName: string;
  cif: string;
  groupDescription: string;
  facilityUse: string;
  contactName: string;
  contactRelationship: string;
  contactMail: string;
  contactPhone: string;
  userConfirmedDocuments: boolean;
  price: number;
  minutes: number;
  billableDays: number;
  hasIncidencesFile?: boolean;
  isOwnBooking?: boolean;
  group?: BasicGroupInfo;
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
