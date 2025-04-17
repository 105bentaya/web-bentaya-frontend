import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, FilterService, SortEvent} from 'primeng/api';
import {PreScout} from '../../models/pre-scout.model';
import {ScoutFormsService} from '../../scout-forms.service';
import {SettingsService} from "../../../settings/settings.service";
import {AssignPreScoutFormComponent} from "../assign-pre-scout-form/assign-pre-scout-form.component";
import {PreScoutAssignation} from "../../models/pre-scout-assignation.model";
import {adminStatuses, statusIsSaveAsScout, statusIsValidForSaving} from "../../models/satus.model";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import FilterUtils from "../../../../shared/util/filter-utils";
import {StatusPipe} from '../../../../shared/pipes/status.pipe';
import {ScoutYearPipe} from '../../../../shared/pipes/scout-year.pipe';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {Table, TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {sections} from "../../../../shared/constant";
import {DatePipe} from "@angular/common";
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {TabsModule} from "primeng/tabs";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {SettingType} from "../../../settings/setting.model";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";

@Component({
  selector: 'app-ser-scout-table',
  templateUrl: './ser-scout-table.component.html',
  styleUrls: ['./ser-scout-table.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    CheckboxModule,
    FormsModule,
    TabsModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    ScoutYearPipe,
    StatusPipe,
    DatePipe,
    TableIconButtonComponent,
    CheckboxContainerComponent
  ]
})
export class SerScoutTableComponent implements OnInit {

  private readonly preScoutService = inject(ScoutFormsService);
  private readonly filterService = inject(FilterService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly settingService = inject(SettingsService);
  private readonly alertService = inject(AlertService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly excelService = inject(ExcelService);

  protected preScouts!: PreScout[];
  protected yearList!: { label: string, year: number }[];
  protected selectedYear!: number;
  protected loading = false;
  protected sections = ["CASTOR", "LOBATO", "SCOUT", "ESCULTA", "ROVER"];
  protected showCurrentYear = false;
  protected excelLoading = false;
  protected multiSelectStatuses!: { id: number | null, name: string }[];
  protected currentYear!: number;
  protected currentYearIndex: number = 0;
  private ref!: DynamicDialogRef;
  @ViewChild('tab') table!: Table;

  ngOnInit(): void {
    this.settingService.getByName(SettingType.CURRENT_YEAR).subscribe(data => this.currentYear = +data.value);
    this.createStatuses();
    this.getPreInscriptions();
  }

  private createStatuses() {
    this.multiSelectStatuses = Object.assign([], adminStatuses);
    this.multiSelectStatuses.pop();
    this.multiSelectStatuses.push({id: null, name: "Sin asignar"});
  }

  private getPreInscriptions() {
    this.preScoutService.getAll().subscribe({
      next: preScouts => {
        this.createYearMenu(preScouts);
        this.preScouts = preScouts;
        this.filterService.register("name-surname-filter", FilterUtils.nameSurnameIdFilter(this.preScouts));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private createYearMenu(preScouts: PreScout[]) {
    const years = new Set<number>();
    preScouts.forEach(preScout => years.add(preScout.inscriptionYear!));
    const yearList = [...years].sort((n1, n2) => n2 - n1);
    this.yearList = yearList.map(year => ({label: `RS ${year - 1}/${year - 2000}`, year: year}));
    this.filterByYear(this.yearList[this.currentYearIndex].year);
  }

  protected exportExcelScout() {
    const filteredPreScouts = this.filterService.filter(this.preScouts, ["inscriptionYear"], this.selectedYear, "equals");
    this.excelLoading = true;
    const booleanPipe = new BooleanPipe();
    this.excelService.exportAsExcel(
      filteredPreScouts.map(pre => ({
        id: pre.id!.toString(), surname: pre.surname, name: pre.name, dni: pre.dni, gender: pre.gender,
        time: pre.creationDate, access: pre.priority.toString(), info: pre.priorityInfo, section: pre.section,
        birthday: pre.birthday, age: pre.age, size: pre.size,
        been: booleanPipe.transform(pre.hasBeenInGroup).toUpperCase(), beenInfo: pre.yearAndSection,
        cont: pre.parentsName, cont1: pre.parentsSurname, cont2: pre.relationship, cont3: pre.email, cont4: pre.phone
      })),
      ["ID", "Apellidos", "Nombre", "DNI o NIE", "Género", "Fecha y hora de inscripción", "Grupo de Acceso",
        "Información grupo de acceso", "Sección", "Fecha de Nacimiento", "Edad", "Talla", "Ha estado antes en el grupo",
        "Información ha estado antes", "Nombre Contacto", "Apellidos", "Parentesco", "Correo", "Teléfono"],
      "preinscripciones"
    );
    this.excelLoading = false;
  }

  protected deleteScout(preScout: PreScout) {
    this.confirmationService.confirm({
      message: "¿Desea borrar esta preinscripción? Esta acción no se podrá deshacer.",
      header: "Eliminar",
      accept: () => {
        if (preScout.id) {
          this.loading = true;
          this.preScoutService.deleteById(preScout.id).subscribe({
            next: () => {
              this.alertService.sendBasicSuccessMessage("Preinscripción borrada con éxito");
              this.getPreInscriptions();
            },
            error: () => this.loading = false
          });
        }
      }
    });
  }

  protected downloadPreScoutAsPdf(preScout: PreScout) {
    const newTab = window.open("", "_blank");
    this.preScoutService.getPreScoutPDF(preScout.id!).subscribe({
      next: pdf => {
        const url = this.blobPdfToUrl(pdf);
        newTab!.location.href = url;
        URL.revokeObjectURL(url);
      },
      error: () => newTab?.close()
    });
  }

  private blobPdfToUrl(pdf: Blob): string {
    return URL.createObjectURL(new Blob([pdf], {type: 'application/pdf'}));
  }

  protected openForm(preScout: PreScout) {
    this.ref = this.dialogService.openDialog(AssignPreScoutFormComponent, `Editar Asignación - ${preScout.name}`, "small", {
      preScout: preScout,
      canEditGroup: true
    });
    this.ref.onClose.subscribe(result => {
      if (result) this.saveAssignation(result, preScout);
    });
  }

  private saveAssignation(preScoutAssignation: PreScoutAssignation, preScout: PreScout) {
    if (statusIsSaveAsScout(preScoutAssignation.status)) {
      this.alertService.sendBasicSuccessMessage("Añadir asignación de educandas");
    } else if (statusIsValidForSaving(preScoutAssignation.status)) {
      this.loading = true;
      this.saveOrUpdate(preScoutAssignation, preScout).subscribe({
          next: () => {
            this.alertService.sendBasicSuccessMessage("Preinscripción guardada con éxito");
            this.getPreInscriptions();
          },
          error: () => this.loading = false
        }
      );
    } else {
      this.alertService.sendBasicErrorMessage("El estado de la preinscripción no es válido");
    }
  }

  private saveOrUpdate(preScoutAssignation: PreScoutAssignation, preScout: PreScout) {
    if (preScout.assignation?.assignationDate) {
      return this.preScoutService.updatePreScoutAssignation(preScoutAssignation);
    } else {
      return this.preScoutService.savePreScoutAssignation(preScoutAssignation);
    }
  }

  protected filterByYear(year: number) {
    if (this.selectedYear != year) {
      this.selectedYear = year;
      this.table.filter(this.selectedYear, 'inscriptionYear', 'equals');
    }
  }

  protected customSort(event: SortEvent) {
    if (event.field == "section") {
      event.data?.sort((one, two) => this.sectionSort(one.section, two.section) * event.order!);
    } else {
      event.data?.sort((one, two) => (one[event.field!].localeCompare(two[event.field!])) * event.order!);
    }
  }

  private sectionSort(one: any, two: any) {
    return sections.indexOf(one) - sections.indexOf(two);
  }
}
