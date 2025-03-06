import {BasicGroupInfo} from "../../../shared/model/group.model";

export interface EventInfo {
  id: number;
  group?: BasicGroupInfo;
  forScouters: boolean;
  forEveryone: boolean
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
