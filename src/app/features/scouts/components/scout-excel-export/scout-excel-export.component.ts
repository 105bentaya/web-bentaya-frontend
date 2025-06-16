import {Component, inject, OnInit} from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Checkbox} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {Button} from "primeng/button";
import {ScoutExcelService} from "../../services/scout-excel.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {finalize} from "rxjs";
import {PagedFilter} from "../../../../shared/model/filter.model";

interface ExcelField {
  field: string;
  label: string;
  pipe?: string;
  listField?: string;
  listFields?: ExcelField[];
}

@Component({
  selector: 'app-scout-excel-export',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionContent,
    AccordionHeader,
    Checkbox,
    FormsModule,
    CheckboxContainerComponent,
    Button
  ],
  templateUrl: './scout-excel-export.component.html',
  styleUrl: './scout-excel-export.component.scss'
})
export class ScoutExcelExportComponent implements OnInit {
  private readonly scoutExcelService = inject(ScoutExcelService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  protected selectedFields: string[] = this.scoutExcelService.getExcelFilter();
  private filter!: PagedFilter;
  protected totalScouts = 0;
  protected loading = false;

  ngOnInit() {
    this.filter = this.config.data?.filter;
    this.totalScouts = this.config.data?.totalScouts;
    this.selectedFields = this.selectedFields.filter(
      field => this.allFields.flatMap(group => group.fields).some(f => f.field === field)
    );
  }

  protected exportExcel() {
    this.loading = true;
    const fieldsToDownload = this.getFieldsForDownload();
    this.scoutExcelService.downloadScoutExcel(this.filter, fieldsToDownload)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => this.ref.close());
  }

  private getFieldsForDownload(): ExcelField[] {
    const selectedFields = this.allFields
      .flatMap(group => group.fields)
      .filter(field => this.selectedFields.includes(field.field));

    const result: ExcelField[] = [];

    selectedFields.forEach(field => {
      if (!field.listField) {
        result.push(field);
      } else {
        const existingListField = result.find(item => item.field === field.listField);
        if (existingListField) {
          existingListField.listFields!.push(field);
        } else {
          const groupInfo = this.allFields.find(
            af => af.groupKey === field.listField
          );
          result.push({
            field: field.listField,
            label: groupInfo?.groupColumnLabel!,
            listFields: [field]
          });
        }
      }
    });

    return result;
  }

  protected saveExcelFields(): void {
    this.scoutExcelService.updateCurrentExcelFilter(this.selectedFields);
  }

  protected readonly allFields: {
    groupLabel: string;
    groupKey: string;
    groupColumnLabel?: string;
    fields: ExcelField[]
  }[] = [
    {
      groupLabel: "Datos Asociativos",
      groupKey: "group",
      fields: [
        {field: 'census', label: 'Censo', pipe: "CENSUS"},
        {field: 'custom.group', label: 'Unidad'},
        {field: 'custom.scoutGroup', label: 'Rama'},
        {field: 'custom.section', label: 'Sección'},
        {field: 'status', label: 'Estado asociativo', pipe: "STATUS"},
        {field: 'federated', label: 'Federado', pipe: "BOOLEAN"},
      ]
    },
    {
      groupLabel: "Datos Personales Básicos",
      groupKey: "basicPersonal",
      fields: [
        {field: 'personalData.name', label: 'Nombre'},
        {field: 'personalData.surname', label: 'Apellidos'},
        {field: 'personalData.feltName', label: 'Nombre Sentido'},
        {field: 'personalData.gender', label: 'Género'},
        {field: 'personalData.birthday', label: 'Fecha de Nacimiento', pipe: "LOCAL_DATE"},
        {field: 'custom.age', label: 'Edad'},
        {field: 'personalData.idDocument.number', label: 'DNI'},
        {field: 'personalData.phone', label: 'Teléfono'},
        {field: 'personalData.landline', label: 'Teléfono fijo'},
        {field: 'personalData.email', label: 'Email'},
        {field: 'personalData.shirtSize', label: 'Talla de camisa'},
        {field: 'personalData.largeFamily', label: 'Familia numerosa', pipe: "BOOLEAN"},
        {field: 'personalData.imageAuthorization', label: 'Autorización imagen', pipe: "BOOLEAN"},
        {field: 'personalData.observations', label: 'Observaciones'}
      ]
    },
    {
      groupLabel: "Datos de Origen Y Residencia",
      groupKey: "addressPersonal",
      fields: [
        {field: 'personalData.birthplace', label: 'Lugar de nacimiento'},
        {field: 'personalData.birthProvince', label: 'Provincia de nacimiento'},
        {field: 'personalData.nationality', label: 'Nacionalidad'},
        {field: 'personalData.address', label: 'Dirección Postas'},
        {field: 'personalData.city', label: 'Ciudad'},
        {field: 'personalData.province', label: 'Provincia'},
        {field: 'personalData.residenceMunicipality', label: 'Municipio de Residencia'},
      ]
    },
    {
      groupLabel: "Contactos",
      groupColumnLabel: "Contacto",
      groupKey: "contactList",
      fields: [
        {field: "contactList.name", label: "Nombre", listField: "contactList"},
        {field: "contactList.surname", label: "Apellidos", listField: "contactList"},
        {field: "contactList.companyName", label: "Razón Social", listField: "contactList"},
        {field: "contactList.relationship", label: "Relación", listField: "contactList"},
        {field: "contactList.donor", label: "Donante", pipe: "BOOLEAN", listField: "contactList"},
        {field: "contactList.idDocument.number", label: "DNI", listField: "contactList"},
        {field: "contactList.phone", label: "Teléfono", listField: "contactList"},
        {field: "contactList.email", label: "Correo", listField: "contactList"},
        {field: "contactList.studies", label: "Estudios", listField: "contactList"},
        {field: "contactList.profession", label: "Profesión", listField: "contactList"},
        {field: "contactList.observations", label: "Observaciones", listField: "contactList"},
      ]
    },
    {
      groupLabel: "Datos Médicos",
      groupKey: "medical",
      fields: [
        {field: 'medicalData.bloodType', label: 'Grupo sanguíneo', pipe: "BLOOD_TYPE"},
        {field: 'medicalData.socialSecurityNumber', label: 'Número de Seguridad Social'},
        {field: 'medicalData.privateInsuranceNumber', label: 'Número de Seguro privado'},
        {field: 'medicalData.privateInsuranceEntity', label: 'Entidad del Seguro privado'},
        {field: 'medicalData.foodIntolerances', label: 'Intolerancias alimentarias'},
        {field: 'medicalData.foodAllergies', label: 'Alergias alimentarias'},
        {field: 'medicalData.foodProblems', label: 'Trastornos alimentarios'},
        {field: 'medicalData.foodDiet', label: 'Dietas'},
        {field: 'medicalData.foodMedication', label: 'Medicación alimentaria'},
        {field: 'medicalData.medicalIntolerances', label: 'Intolerancias médicas'},
        {field: 'medicalData.medicalAllergies', label: 'Alergias médicas'},
        {field: 'medicalData.medicalDiagnoses', label: 'Diagnósticos médicos'},
        {field: 'medicalData.medicalPrecautions', label: 'Precauciones médicas'},
        {field: 'medicalData.medicalMedications', label: 'Medicación general prescrita'},
        {field: 'medicalData.medicalEmergencies', label: 'Emergencias médicas'},
        {field: 'medicalData.addictions', label: 'Adicciones'},
        {field: 'medicalData.tendencies', label: 'Tendencias'},
        {field: 'medicalData.records', label: 'Antecedentes'},
        {field: 'medicalData.bullyingProtocol', label: 'Protocolo de acoso'},
      ]
    },
    {
      groupLabel: "Otros Datos",
      groupKey: "others",
      fields: [
        {field: 'economicData.iban', label: 'IBAN'},
        {field: 'economicData.bank', label: 'Banco'},
        {field: 'scoutHistory.progressions', label: 'Progresiones'},
        {field: 'scoutHistory.observations', label: 'Observaciones (historial scout)'}
      ]
    }
  ];
}
