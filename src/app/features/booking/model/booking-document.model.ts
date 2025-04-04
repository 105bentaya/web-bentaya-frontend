export interface BookingDocument {
  id: number;
  bookingId: number;
  fileName: string;
  status: DocumentStatus;
  typeId: number;
}

export interface BookingDocumentType {
  id: number;
  name: string;
  description: string;
}

export type DocumentStatus = "PENDING" | "ACCEPTED" | "REJECTED";
