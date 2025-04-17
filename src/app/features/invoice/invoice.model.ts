export interface Invoice {
  id: number;
  invoiceDate: Date | string;
  issuer: string;
  invoiceNumber: string;
  nif: string;
  amount: number;
  receipt: boolean;
  complies: boolean;
  paymentDate: Date | string;
  method: string;
  liquidated: boolean;
  observations?: string;
  expenseType: InvoiceExpenseType;
  grant?: InvoiceGrant;
  payer: InvoicePayer;
  files: InvoiceFile[]
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
  group: number;
}

export interface InvoiceFile {
  id: number;
  uuid: string;
  name: string;
  mimeType: string;
}
