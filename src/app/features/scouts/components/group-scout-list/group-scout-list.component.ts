import {Component, inject, OnInit} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ScoutService} from "../../services/scout.service";
import {FilterService, SelectItem} from "primeng/api";
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {SettingsService} from "../../../settings/settings.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import FilterUtils from "../../../../shared/util/filter-utils";
import {ScoutYearPipe} from '../../../../shared/pipes/scout-year.pipe';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DatePipe, NgClass} from '@angular/common';
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {RouterLink} from "@angular/router";
import {Scout} from "../../models/scout.model";

@Component({
  selector: 'app-group-scout-list',
  templateUrl: './group-scout-list.component.html',
  styleUrls: ['./group-scout-list.component.scss'],
  providers: [DynamicDialogService, DialogService],
  imports: [
    SelectButtonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    NgClass,
    DatePipe,
    ScoutYearPipe,
    Button,
    RouterLink
  ]
})
export class GroupScoutListComponent implements OnInit {

  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly filterService = inject(FilterService);
  private readonly settingService = inject(SettingsService);
  private readonly excelService = inject(ExcelService);

  protected scouts: Scout[] | undefined;
  protected loading = false;
  protected userGroup: BasicGroupInfo | undefined = inject(LoggedUserDataService).getGroup();
  private readonly name: string = "";
  private ref!: DynamicDialogRef;
  protected currentYear!: number;
  protected excelLoading = false;
  protected showAll = false;
  protected options: SelectItem[] = [];

  protected showDialog: boolean = false;

  constructor() {
    if (this.userGroup) {
      this.name = this.userGroup.name;
      this.options = [{label: this.name, value: false}, {label: 'Grupo', value: true}];
    } else {
      this.showAll = true;
    }
  }

  ngOnInit() {
    this.getScouts();
    // this.userGroup ? this.getGroupScouts() : this.getScouts();
  }

  protected selectButtonChange() {
    if (!this.scouts) {
      this.getScouts();
    }
  }

  private getScouts() {
    this.loading = true;
    this.scoutService.getAll().subscribe({
      next: scouts => {
        this.scouts = scouts;
        this.filterService.register("name-surname-filter", FilterUtils.nameSurnameFilter(this.scouts));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  protected exportExcelScout() {
    if (this.showAll) {
      // todo excel this.excelService.exportAsExcel(
      //   ScoutHelper.generateData(this.scouts!, true),
      //   ScoutHelper.generateExcelColumns(this.scouts!, true),
      //   "educandas"
      // );
    }
  }
}

