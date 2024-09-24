export interface BookingDocument {
  id: number;
  bookingId: number;
  fileName: string;
  status: DocumentStatus;
}


export type DocumentStatus = "PENDING" | "ACCEPTED" | "REJECTED";
