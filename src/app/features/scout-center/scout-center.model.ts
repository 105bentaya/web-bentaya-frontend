export interface ScoutCenter { //todo repasar todos
  id: number;
  name: string;
  place: string;
  maxCapacity: number;
  minExclusiveCapacity: number;
  information: string;
  features: string[];
  price: number;
  icon: string;
  color: string;
}

export interface ScoutCenterInformation {
  id: number;
  name: string;
  place: string;
  maxCapacity: number;
  minExclusiveCapacity: number;
  information: string;
  features: string[];
  price: number;
  photos: ScoutCenterFile[];
  mainPhoto?: ScoutCenterFile;
  icon: string;
  color: string;
}

export interface ScoutCenterWithFiles {
  scoutCenter: ScoutCenter;
  rules?: ScoutCenterFile;
  incidencesDoc?: ScoutCenterFile
  attendanceDoc?: ScoutCenterFile
  mainPhoto?: ScoutCenterFile;
  photos: ScoutCenterFile[]
}

export interface ScoutCenterFile {
  id?: number;
  uuid: string;
  name: string;
  mimeType: string;
}
