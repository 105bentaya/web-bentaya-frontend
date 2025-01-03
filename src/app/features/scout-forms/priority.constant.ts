export interface PreScoutPriority {
  name: string;
  value: number;
  message: string;
  label?: string;
  requiresExtraInfo: boolean;
  summary: string;
}

export const preScoutPriorities: PreScoutPriority[] = [
  {
    name: "Grupo 1",
    value: 1,
    message: "Tiene hermanos/as en el grupo desde al menos la Ronda Solar anterior o es hija de scouter del grupo.",
    requiresExtraInfo: true,
    label: "Nombre y unidad de dicho familiar",
    summary: "Grupo 1.- Hermanos/as en el grupo o es hijo/a de scouters"
  },
  {
    name: "Grupo 2",
    value: 2,
    message: "Ha sido scout en el grupo o es hija de scouters o scouts que hayan pertenecido a Scouts 105 Bentaya.",
    requiresExtraInfo: true,
    label: "Nombre de dicho scout o scouter",
    summary: "Grupo 2.- Ha sido scout o es hijo/a de antiguos scouts del grupo"
  },
  {
    name: "Ninguna de las anteriores",
    value: 3,
    message: "Ninguna de las anteriores (se tendrá en cuenta el orden por fecha de preinscripción).",
    requiresExtraInfo: false,
    summary: "Ninguno"
  }
];
