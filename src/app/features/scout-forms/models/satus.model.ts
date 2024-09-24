export const statuses = [
  {id: 0, name: "Asignada"},
  {id: 1, name: "Esperando Reunión"},
  {id: 2, name: "Esperando Papeles"},
  {id: 3, name: "Rechazada"},
  {id: 4, name: "Guardar y añadir"}
];

export const adminStatuses = [
  {id: 0, name: "Asignada"},
  {id: 1, name: "Esperando Reunión"},
  {id: 2, name: "Esperando Papeles"},
  {id: 3, name: "Rechazada"},
  {id: -1, name: "Desasignar"}
];

export function statusIsSaveAsScout(status: number): boolean {
  return status == 4;
}

export function statusIsRejected(status: number): boolean {
  return status == 3;
}

export function statusIsValidForSaving(status: number): boolean {
  return status == 0 || status == 1 || status == 2 || status == 3 || status == -1;
}
