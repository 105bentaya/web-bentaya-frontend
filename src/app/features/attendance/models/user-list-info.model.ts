export interface UserListInfo {
  scoutId: number;
  name: string;
  surname: string;
  info: {
    eventId: number;
    eventStartDate: Date;
    eventEndDate: Date;
    eventTitle: string;
    attending?: boolean;
    closed: boolean;
    payed?: boolean;
    endsSoon: boolean
  }[]
}
