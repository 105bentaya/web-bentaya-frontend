import {Component, inject, OnInit, viewChild} from '@angular/core';
import {ScoutService} from "../../services/scout.service";
import {DialogService} from "primeng/dynamicdialog";
import {SelectItem} from "primeng/api";
import {BasicGroupInfo, Section} from "../../../../shared/model/group.model";
import FilterUtils from "../../../../shared/util/filter-utils";
import {MultiSelect} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {Table, TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {GroupService} from "../../../../shared/services/group.service";
import {ScoutListData, ScoutType} from "../../models/scout.model";
import {DatePipe, TitleCasePipe} from "@angular/common";
import {ScoutYearPipe} from "../../../../shared/pipes/scout-year.pipe";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SettingsService} from "../../../settings/settings.service";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {finalize} from "rxjs";
import {CensusPipe} from "../../pipes/census.pipe";
import {ScoutGroupPipe} from "../../pipes/scout-group.pipe";
import {IdDocumentPipe} from "../../pipes/id-document.pipe";
import {SettingType} from "../../../settings/setting.model";
import {ScoutSectionPipe} from "../../pipes/scout-section.pipe";
import {PagedFilter} from "../../../../shared/model/filter.model";
import {DatePicker} from "primeng/datepicker";
import {genders} from "../../../../shared/constant";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {UserRole} from "../../../users/models/role.model";
import {Tab, TabList, Tabs} from "primeng/tabs";
import {Badge} from "primeng/badge";

@Component({
  selector: 'app-scout-list',
  templateUrl: 'scout-list.component.html',
  styleUrls: ['scout-list.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    SelectButtonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    DatePipe,
    ScoutYearPipe,
    Button,
    RouterLink,
    MultiSelect,
    CensusPipe,
    ScoutGroupPipe,
    IdDocumentPipe,
    ScoutSectionPipe,
    TitleCasePipe,
    DatePicker,
    GeneralAButtonComponent,
    Tabs,
    TabList,
    Tab,
    Badge
  ]
})

export class ScoutListComponent implements OnInit {
  private readonly scoutService = inject(ScoutService);
  private readonly settingService = inject(SettingsService);
  protected readonly groupService = inject(GroupService);
  private readonly userData = inject(LoggedUserDataService);

  protected readonly FilterUtils = FilterUtils;
  protected readonly genders = genders;
  protected readonly sections: ({ label: string; value: Section })[] = [
    {label: "Castores", value: "CASTORES"},
    {label: "Lobatos", value: "LOBATOS"},
    {label: "Scouts", value: "SCOUTS"},
    {label: "Escultas", value: "ESCULTAS"},
    {label: "Rovers", value: "ROVERS"},
    {label: "Scouters", value: "SCOUTERS"},
    {label: "Scoutsupport", value: "SCOUTSUPPORT"},
  ];

  protected isSecretary = this.userData.hasRequiredPermission(UserRole.SECRETARY);
  protected tabValue!: "PENDING" | "ALL";
  protected pendingRegistrations: number | undefined;

  protected groups!: BasicGroupInfo[];
  protected quickFilters: SelectItem[] = [];

  protected userGroup: BasicGroupInfo | undefined = this.userData.getScouterGroup();
  protected currentYear!: number;

  protected selectedFilter: "GROUP" | "ALL" | "IMAGE";
  protected excelLoading = false;

  table = viewChild.required(Table);
  protected scouts!: ScoutListData[];
  protected loading = true;
  protected totalRecords!: number;

  constructor() {
    this.quickFilters = [{label: 'Grupo', value: "ALL"}, {label: 'Sin Imagen', value: "IMAGE"}];
    if (this.userGroup) {
      this.quickFilters.unshift({label: this.userGroup.name, value: "GROUP"});
      this.selectedFilter = "GROUP";
    } else {
      this.selectedFilter = "ALL";
    }

    const lastFilter = this.scoutService.lastFilter;
    if (lastFilter) {
      this.selectedFilter = lastFilter;
    }
  }

  ngOnInit() {
    this.settingService.getByName(SettingType.CURRENT_YEAR).subscribe(setting => this.currentYear = +setting.value);
    this.groupService.getBasicGroups({allGroups: true}).subscribe(groups => this.groups = groups);

    if (this.isSecretary) {
      this.scoutService.getTotalPendingRegistrations().subscribe(totalPending => {
        this.tabValue = totalPending ? "PENDING" : "ALL";
        this.pendingRegistrations = totalPending;
        this.onPendingFilterChange(this.tabValue);
      });
    } else {
      this.selectButtonChange();
    }
  }

  protected onPendingFilterChange(tab: any) {
    if (tab === "PENDING") {
      this.loadPendingRegistrations();
    } else {
      this.table().filter([], 'statuses', 'custom');
    }
  }

  private loadPendingRegistrations() {
    this.selectedFilter = "ALL";
    this.selectButtonChange();
    this.table().filter(["PENDING_NEW", "PENDING_EXISTING"], 'statuses', 'custom');
  }

  protected selectButtonChange() {
    this.scoutService.lastFilter = this.selectedFilter;

    if (this.selectedFilter === "GROUP") {
      this.table().filter([this.userGroup!.id], 'groupIds', 'custom');
      this.table().filter([], 'sections', 'custom');
    } else {
      this.table().filter([], 'groupIds', 'custom');
    }

    if (this.selectedFilter === "IMAGE") {
      this.table().filter(false, 'imageAuthorization', 'custom');
    } else {
      this.table().filter(null, 'imageAuthorization', 'custom');
    }
  }

  protected loadData(tableLazyLoadEvent: any) {
    this.loading = true;
    this.scoutService.getAllFiltered(this.getFilter(tableLazyLoadEvent))
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => {
        this.scouts = result.data;
        this.totalRecords = result.count;
      });
  }

  private getFilter(tableLazyLoadEvent: any): PagedFilter {
    const groupFilter = tableLazyLoadEvent.filters.groupIds;
    if (groupFilter) {
      const realGroupFilter: number[] = groupFilter.value.filter((id: number) => id > 0);
      const sectionFilter: ScoutType[] = groupFilter.value.filter((id: number) => id < 1).map((id: number) => {
        if (id === -1) {
          return "SCOUTER";
        } else if (id === -2) {
          return "COMMITTEE";
        } else if (id === -3) {
          return "MANAGER";
        } else {
          return "INACTIVE";
        }
      });
      groupFilter.value = realGroupFilter;
      tableLazyLoadEvent.filters.scoutTypes = {value: sectionFilter};
    } else {
      delete tableLazyLoadEvent.filters.scoutTypes;
    }

    return FilterUtils.lazyEventToFilter(tableLazyLoadEvent);
  }

  protected exportExcelScout() {
    //todo excel this.excelService.exportAsExcel(
    //   ScoutHelper.generateData(this.scouts!, true),
    //   ScoutHelper.generateExcelColumns(this.scouts!, true),
    //   "educandas"
    // );
  }
}
