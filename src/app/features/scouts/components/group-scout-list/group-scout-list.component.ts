import {Component, inject, OnInit} from '@angular/core';
import {Scout} from "../../models/scout.model";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ScoutService} from "../../services/scout.service";
import {FilterService, SelectItem} from "primeng/api";
import {ScoutFormComponent} from "../scout-form/scout-form.component";
import {noop} from "rxjs";
import {LoggedUserInformationService} from "../../../../core/auth/services/logged-user-information.service";
import {groups} from "../../../../shared/model/group.model";
import {ScoutInfoComponent} from "../scout-info/scout-info.component";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {SettingsService} from "../../../../core/settings/settings.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import ScoutHelper from "../../scout.util";
import {SentenceCasePipe} from "../../../../shared/pipes/sentence-case.pipe";
import FilterUtils from "../../../../shared/util/filter-utils";
import {ScoutYearPipe} from '../../../../shared/pipes/scout-year.pipe';
import {GroupPipe} from '../../../../shared/pipes/group.pipe';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DatePipe, NgClass} from '@angular/common';
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";

@Component({
  selector: 'app-group-scout-list',
  templateUrl: './group-scout-list.component.html',
  styleUrls: ['./group-scout-list.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    SelectButtonModule,
    FormsModule,
    TableModule,
    ButtonDirective,
    InputTextModule,
    NgClass,
    GroupPipe,
    DatePipe,
    ScoutYearPipe
  ]
})
export class GroupScoutListComponent implements OnInit {

  private readonly scoutService = inject(ScoutService);
  private readonly dialogService = inject(DialogService);
  private readonly filterService = inject(FilterService);
  private readonly settingService = inject(SettingsService);
  private readonly excelService = inject(ExcelService);

  protected scouts: Scout[] | undefined;
  protected loading = false;
  protected groupScouts!: Scout[];
  protected userGroup = inject(LoggedUserDataService).getGroupId();
  private readonly name: string = "";
  private ref!: DynamicDialogRef;
  protected currentYear!: number;
  protected excelLoading = false;
  protected showAll = false;
  protected options: SelectItem[] = [];

  constructor() {
    if (this.userGroup) {
      this.name = new SentenceCasePipe().transform(groups[this.userGroup].name);
      this.options = [{label: this.name, value: false}, {label: 'Grupo', value: true}];
    } else {
      this.showAll = true;
    }
  }

  ngOnInit() {
    !!this.userGroup ? this.getGroupScouts() : this.getScouts();
  }

  private getGroupScouts() {
    this.settingService.getByName("currentYear").subscribe(data => this.currentYear = +data.value);
    this.scouts = undefined;
    this.scoutService.getAllByCurrentGroup().subscribe({
      next: scouts => {
        this.groupScouts = scouts;
        this.filterService.register("name-surname-filter", FilterUtils.nameSurnameFilter(this.groupScouts));
      }
    });
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

  protected viewScout(scout: Scout) {
    this.ref = this.dialogService.open(ScoutInfoComponent, {
      header: `Datos de ${scout.name}`,
      styleClass: 'small dialog-width',
      data: scout
    });
  }

  protected openEditDialog(scout: Scout) {
    this.ref = this.dialogService.open(ScoutFormComponent, {
      header: 'Editar Educanda',
      styleClass: 'medium dialog-width',
      data: {scout: scout}
    });
    this.ref.onClose.subscribe(saved => saved ? this.getGroupScouts() : noop());
  }

  protected exportExcelScout() {
    this.excelLoading = true;
    if (this.showAll) {
      this.excelService.exportAsExcel(
        ScoutHelper.generateData(this.scouts!, true),
        ScoutHelper.generateExcelColumns(this.scouts!, true),
        "educandas"
      );
    } else {
      this.excelService.exportAsExcel(
        ScoutHelper.generateData(this.groupScouts),
        ScoutHelper.generateExcelColumns(this.groupScouts),
        "educandas-" + this.name.toLowerCase()
      );
    }
    this.excelLoading = false;
  }
}

