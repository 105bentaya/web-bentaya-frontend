export interface BookingForm {
  groupName: string;
  cif: string;
  workDescription: string;
  contactName: string;
  relationship: string;
  email: string;
  phone: string;
  packs: number;
  scoutCenterId: number;
  startDate: Date | string;
  endDate: Date | string;
  observations: string;
  exclusiveReservation: boolean;
}
