import {Component, inject, OnInit} from '@angular/core';
import {ScoutService} from "../../services/scout.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, FilterService} from "primeng/api";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {ExcelService} from "../../../../shared/services/excel.service";
import FilterUtils from "../../../../shared/util/filter-utils";
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {GroupService} from "../../../../shared/services/group.service";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";
import {Scout} from "../../models/scout.model";

@Component({
  selector: 'app-scout-list',
  templateUrl: 'scout-list.component.html',
  styleUrls: ['scout-list.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    TableModule,
    InputTextModule,
    MultiSelectModule,
    Button,
    TableIconButtonComponent,
    BooleanPipe
  ]
})

export class ScoutListComponent implements OnInit {
  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly filterService = inject(FilterService);
  private readonly alertService = inject(AlertService);
  private readonly excelService = inject(ExcelService);
  protected readonly groupService = inject(GroupService);

  protected scouts!: Scout[];
  protected loading = false;
  private ref!: DynamicDialogRef;
  protected groups!: BasicGroupInfo[];
  protected excelLoading = false;

  ngOnInit() {
    this.groupService.getBasicGroups({uppercase: true}).subscribe(groups => this.groups = groups);
    this.getScouts();
  }

  private getScouts() {
    this.scoutService.getAll().subscribe({
      next: scouts => {
        this.scouts = scouts;
        this.filterService.register("name-surname-filter", FilterUtils.nameSurnameFilter(this.scouts));
      }
    });
  }

  protected exportExcelScout() {
    this.excelLoading = true;
    // todo
    // this.excelService.exportAsExcel(
    //   ScoutHelper.generateData(this.scouts, true),
    //   ScoutHelper.generateExcelColumns(this.scouts, true),
    //   "educandas"
    // );
    this.excelLoading = false;
  }
}
