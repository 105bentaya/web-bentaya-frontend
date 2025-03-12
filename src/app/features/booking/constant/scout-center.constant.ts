import {terreno} from "./terreno.information";
import {refugioTerreno} from "./refugio-terreno.information";
import {tejeda} from "./tejeda.information";
import {palmital} from "./palmital.information";

export const ScoutCenters = [
  "TERRENO", "REFUGIO_TERRENO", "TEJEDA", "PALMITAL"
];

export const documents: { name: string, path?: string }[] = [
  {name: "Registro de Asociaciones o registro acreditativo del Centro Educativo, según corresponda"},
  {name: "Copia de los estatutos o documento acreditativo del Centro Educativo, según corresponda"},
  {name: "Recibo vigente de seguro de responsabilidad civil, si así corresponde"},
  {name: "Recibo vigente del seguro de accidentes, si así corresponde"},
  {name: "Comprobante del ingreso, a nuestro favor, de la aportación por la cesión de uso en nuestra cuenta corriente (ES29 2100 1675 3402 0039 5888)"},
  {name: "Listado de asistentes", path: "assets/files/booking/REGISTRO DE ASISTENTES.docx"}
];

export const ScoutCentersInfo = {
  "TERRENO": terreno,
  "REFUGIO_TERRENO": refugioTerreno,
  "TEJEDA": tejeda,
  "PALMITAL": palmital
};

export const scoutCentersDropdown = [
  {label: "Campamento Bentaya", value: "TERRENO"},
  {label: "Refugio Luis Martín", value: "REFUGIO_TERRENO"},
  {label: "Refugio Bentayga", value: "TEJEDA"},
  {label: "Aula de la Naturaleza El Palmital", value: "PALMITAL"},
];

export type ScoutCenter = "TERRENO" | "TEJEDA" | "REFUGIO_TERRENO" | "PALMITAL";

export function centerIsAlwaysExclusive(center: ScoutCenter) {
  return center == "TEJEDA" || center == "REFUGIO_TERRENO";
}
