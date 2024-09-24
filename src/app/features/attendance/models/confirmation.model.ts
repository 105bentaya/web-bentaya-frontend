export interface Confirmation {
  scoutId: number;
  eventId: number;
  attending?: boolean;
  text: string;
  payed?: boolean;
}
