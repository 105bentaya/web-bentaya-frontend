export interface EventAttendanceInfo {
  name: string;
  surname: string;
  scoutId: number;
  attending?: boolean;
  text: string;
  medicalData: string;
  payed?: boolean;
}
