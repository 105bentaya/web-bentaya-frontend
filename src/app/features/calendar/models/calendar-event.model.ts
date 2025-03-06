export interface CalendarEvent {
  id: number;
  groupId?: number;
  title: string;
  startDate: Date;
  endDate: Date;
  unknownTime: boolean;
  forEveryone: boolean;
  forScouters: boolean;
}
