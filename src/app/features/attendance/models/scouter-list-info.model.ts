export interface ScouterListInfo {
  eventId: number;
  eventTitle: string;
  eventStartDate: Date;
  eventEndDate: Date;
  eventHasPayment: boolean;
  eventIsClosed: boolean;
  affirmativeConfirmations: number;
  negativeConfirmations: number;
  notRespondedConfirmations: number;
  affirmativeAndPayedConfirmations?: number;
}
