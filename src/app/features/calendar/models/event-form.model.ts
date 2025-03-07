export interface EventForm {
  id?: number;
  groupId?: number;
  forScouters: boolean;
  forEveryone: boolean
  title: string;
  description: string;
  location: string;
  meetingLocation?: string;
  pickupLocation?: string;
  startDate: Date;
  endDate: Date;
  localStartDate?: Date | string;
  localEndDate?: Date | string;
  activateAttendanceList: boolean;
  activateAttendancePayment: boolean;
  closeAttendanceList: boolean;
  unknownTime: boolean;
  closeDateTime?: Date;
}
