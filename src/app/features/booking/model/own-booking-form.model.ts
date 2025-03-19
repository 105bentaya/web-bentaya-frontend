export interface OwnBookingForm {
  id?: number;
  packs: number;
  scoutCenterId: number;
  startDate: Date | string;
  endDate: Date | string;
  observations: string;
  exclusiveReservation: boolean;
}
