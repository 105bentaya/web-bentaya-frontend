import {ScoutCenter} from "../constant/scout-center.constant";
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
  scoutCenter: ScoutCenter;
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
}
