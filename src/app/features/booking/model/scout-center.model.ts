export interface ScoutCenter {
  id: number;
  name: string;
  maxCapacity: number;
  minExclusiveCapacity: number;
  information: string;
  features: string[];
  price: number;
}
