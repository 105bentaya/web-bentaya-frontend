export interface Invoice {
  id: number;
  invoiceDate: Date;
  issuer: string;
  invoiceNumber: string;
  nif: string;
  amount: number;
  receipt: boolean;
  complies: boolean;
  paymentDate: Date;
  method: string;
  liquidated: boolean;
  observations?: string;
  expenseType: InvoiceExpenseType;
  grant?: InvoiceGrant;
  payer: InvoicePayer;
}

export interface InvoiceData {
  expenseTypes: InvoiceExpenseType[];
  grants: InvoiceGrant[];
  payers: InvoicePayer[];
}

export interface InvoiceExpenseType {
  id: number;
  expenseType: string;
}

export interface InvoiceGrant {
  id: number;
  grantName: string;
}

export interface InvoicePayer {
  id: number;
  payer: string;
  groupId: number;
}
