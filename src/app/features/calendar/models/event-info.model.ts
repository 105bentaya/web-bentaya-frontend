export interface EventInfo {
  id: number;
  groupId: number;
  title: string;
  description: string;
  location: string;
  longitude?: number;
  latitude?: number;
  startDate: Date;
  endDate: Date;
  hasAttendance: boolean;
  unknownTime: boolean;
  attendanceIsClosed: boolean;
  closeDateTime?: Date;
}
