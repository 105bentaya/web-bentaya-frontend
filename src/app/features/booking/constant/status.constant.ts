export const bookingStatusValues: { [key: string]: { label: string; severity: string } } = {
  NEW: {label: "Nueva Pre Reserva", severity: "primary"},
  RESERVED: {label: "Pre Reserva Aceptada", severity: "warn"},
  OCCUPIED: {label: "Reserva Confirmada", severity: "success"},
  CANCELED: {label: "Reserva Cancelada", severity: "danger"},
  REJECTED: {label: "Reserva Denegada", severity: "danger"},
};

export const bookingStatuses = Object.entries(bookingStatusValues).map(
  ([value, {label, severity}]) => ({
    value,
    label,
    severity
  })
);

export enum Status {
  NEW = "NEW",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
}

