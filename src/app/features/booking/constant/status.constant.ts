export const scoutCenterStatusesValues = [
  {label: "Nueva Pre Reserva", value: "NEW", styleClass: "bg-primary-subtle"},
  {label: "Pre Reserva Aceptada", value: "RESERVED", styleClass: "bg-warning-subtle"},
  {label: "Reserva Confirmada", value: "OCCUPIED", styleClass: "bg-success-subtle"},
  {label: "Reserva Con Exclusividad Confirmada", value: "FULLY_OCCUPIED", styleClass: "bg-success-subtle"},
  {label: "Reserva Finalizada y Revisada", value: "FINISHED", styleClass: "bg-success-subtle"},
  {label: "Reserva Cancelada", value: "CANCELED", styleClass: "bg-danger-subtle"},
  {label: "Reserva Denegada", value: "REJECTED", styleClass: "bg-danger-subtle"},
  {label: "Reserva Finalizada a la espera de revisión", value: "LEFT", styleClass: "bg-warning-subtle"}
];


export type Status = "NEW" | "RESERVED" | "OCCUPIED" | "FULLY_OCCUPIED" | "FINISHED" | "CANCELED" | "REJECTED" | "LEFT";

