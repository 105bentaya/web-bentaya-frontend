export interface FormEvent {
  id?: number;
  groupId: number;
  title: string;
  description: string;
  location: string;
  longitude?: number;
  latitude?: number;
  startDate: Date;
  endDate: Date;
  localStartDate?: Date | string;
  localEndDate?: Date | string;
  activateAttendanceList: boolean;
  activateAttendancePayment: boolean;
  closeAttendanceList: boolean;
  unknownTime: boolean;
}
