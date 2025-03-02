import {Component, inject, OnInit} from '@angular/core';
import {Scout} from "../../models/scout.model";
import {ScoutService} from "../../services/scout.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ScoutFormComponent} from "../scout-form/scout-form.component";
import {ConfirmationService, FilterService} from "primeng/api";
import {noop} from "rxjs";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {unitGroups} from "../../../../shared/model/group.model";
import {ExcelService} from "../../../../shared/services/excel.service";
import ScoutHelper from "../../scout.util";
import FilterUtils from "../../../../shared/util/filter-utils";
import {GroupPipe} from '../../../../shared/pipes/group.pipe';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-scout-list',
  templateUrl: 'scout-list.component.html',
  styleUrls: ['scout-list.component.scss'],
  providers: [DialogService],
  imports: [
    TableModule,
    InputTextModule,
    MultiSelectModule,
    GroupPipe,
    Button
  ]
})

export class ScoutListComponent implements OnInit {
  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly filterService = inject(FilterService);
  private readonly alertService = inject(AlertService);
  private readonly excelService = inject(ExcelService);

  protected scouts!: Scout[];
  protected loading = false;
  private ref!: DynamicDialogRef;
  protected readonly groups = unitGroups;
  protected excelLoading = false;

  ngOnInit() {
    this.getScouts();
  }

  private getScouts() {
    this.scoutService.getAllAndDisabled().subscribe({
      next: scouts => {
        this.scouts = scouts;
        this.filterService.register("name-surname-filter", FilterUtils.nameSurnameFilter(this.scouts));
      }
    });
  }

  protected openAddDialog() {
    this.ref = this.dialogService.open(ScoutFormComponent, {
      header: 'Añadir Persona Educanda',
      styleClass: 'medium-dw dialog-width'
    });
    this.ref.onClose.subscribe(saved => saved ? this.getScouts() : noop());
  }

  protected openEditDialog(scout: Scout) {
    this.ref = this.dialogService.open(ScoutFormComponent, {
      header: 'Editar Persona Educanda',
      styleClass: 'medium-dw dialog-width',
      data: {scout: scout}
    });
    this.ref.onClose.subscribe(saved => saved ? this.getScouts() : noop());
  }

  protected deleteScout(scout: Scout) {
    this.confirmationService.confirm({
      message: "¿Desea borrar esta persona educanda? Esta acción no se podrá deshacer.",
      header: "Eliminar",
      accept: () => {
        if (scout.id) {
          this.loading = true;
          this.scoutService.delete(scout).subscribe({
            next: () => {
              this.getScouts();
              this.alertService.sendBasicSuccessMessage("Éxito al borrar");
              this.loading = false;
            },
            error: () => this.loading = false
          });
        }
      }
    });
  }

  protected exportExcelScout() {
    this.excelLoading = true;
    this.excelService.exportAsExcel(
      ScoutHelper.generateData(this.scouts, true),
      ScoutHelper.generateExcelColumns(this.scouts, true),
      "educandas"
    );
    this.excelLoading = false;
  }
}
