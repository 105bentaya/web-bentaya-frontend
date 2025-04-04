export interface BookingDocument {
  id: number;
  bookingId: number;
  fileName: string;
  status: DocumentStatus;
  typeId: number;
  duration?: DocumentDuration;
  expirationDate?: Date;
}

export interface BookingDocumentType {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface BookingDocumentForm {
  status: DocumentStatus;
  duration?: DocumentDuration;
  expirationDate?: Date | string;
}

export type DocumentStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type DocumentDuration = "PERMANENT" | "EXPIRABLE" | "SINGLE_USE";
