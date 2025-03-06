import {Scout} from "./models/scout.model";
import {DatePipe} from "@angular/common";

export default class ScoutHelper {

  static generateData(scoutList: Scout[], addSection = false) {
    const datePipe = new DatePipe("es");
    return scoutList.map(scout => {
      let tempScout: { [k: string]: any } = {
        id: scout.census?.toString(),
        surname: scout.surname,
        name: scout.name,
      };
      if (addSection) {
        tempScout = {...tempScout, sect: scout.group.name};
      }
      tempScout = {
        ...tempScout,
        dni: scout.dni,
        birthday: datePipe.transform(scout.birthday, "dd/MM/y"),
        gender: scout.gender,
        municipality: scout.municipality,
        size: scout.shirtSize,
        image: scout.imageAuthorization ? 'Sí' : 'No',
        medical: scout.medicalData,
        progression: scout.progressions,
        observation: scout.observations
      };
      for (let i = 0; i < scout.contactList.length; i++) {
        tempScout[`c-${i}-0`] = scout.contactList[i].name;
        tempScout[`c-${i}-1`] = scout.contactList[i]?.relationship || "";
        tempScout[`c-${i}-2`] = scout.contactList[i]?.email || "";
        tempScout[`c-${i}-3`] = scout.contactList[i]?.phone || "";
      }
      return tempScout;
    });
  }

  static generateExcelColumns(scoutList: Scout[], addSection = false) {
    const result = ["Censo", "Apellidos", "Nombre"];
    if (addSection) {
      result.push("Unidad");
    }
    result.push("DNI o NIE", "Fecha de Nacimiento", "Género", "Municipio de Residencia", "Talla", "Uso de Imagen",
      "Datos Médicos", "Progresiones", "Observaciones de Scouter");

    const maxContacts = scoutList.reduce((w, r) => Math.max(w, r.contactList.length), 0);
    for (let i = 1; i <= maxContacts; i++) {
      result.push(`Contacto ${i} - Nombre`);
      result.push("Parentesco");
      result.push("Correo");
      result.push("Número");
    }

    return result;
  }
}
