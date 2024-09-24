export interface Payment {
  id: number;
  orderNumber: string;
  status: number;
  paymentType: string;
  modificationDate: Date;
  amount: number;
}
