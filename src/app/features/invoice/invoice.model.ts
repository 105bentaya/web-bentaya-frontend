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
  expenseType: InvoiceConceptType;
  grant?: InvoiceGrant;
  payer: InvoicePayer;
  files: InvoiceFile[]
}

export interface InvoiceData {
  expenseTypes: InvoiceConceptType[];
  grants: InvoiceGrant[];
  payers: InvoicePayer[];
  autocompleteOptions: IssuerNif[]
}

export interface InvoiceTypes {
  expenseTypes: InvoiceConceptType[];
  incomeTypes: InvoiceConceptType[];
}

export interface InvoiceConceptType {
  id: number;
  description: string;
  donation?: boolean
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

export interface IssuerNif {
  issuer: string;
  nif: string;
}
