import {Component, inject, OnInit, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {SpecialMemberService} from "../../special-member.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SpecialMemberBasicData, SpecialMemberRole} from "../../models/special-member.model";
import {CensusPipe} from "../../../scouts/pipes/census.pipe";
import {InputText} from "primeng/inputtext";
import FilterUtils from "../../../../shared/util/filter-utils";
import {finalize} from "rxjs";
import {Tab, TabList, Tabs} from "primeng/tabs";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserRole} from "../../../users/models/role.model";

@Component({
  selector: 'app-special-member-list',
  imports: [
    Button,
    TableModule,
    RouterLink,
    CensusPipe,
    InputText,
    Tab,
    TabList,
    Tabs
  ],
  templateUrl: './special-member-list.component.html',
  styleUrl: './special-member-list.component.scss'
})
export class SpecialMemberListComponent implements OnInit {

  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected isSecretary = inject(LoggedUserDataService).hasRequiredPermission(UserRole.SECRETARY);
  protected specialMemberInfo!: SpecialMemberBasicData[];
  protected loading = true;
  protected totalRecords!: number;

  protected tabValue: SpecialMemberRole;

  table = viewChild.required<Table>("table");

  constructor() {
    this.tabValue = this.isSecretary ? this.route.snapshot.queryParams["tab"] ?? "HONOUR" : "DONOR";
  }

  ngOnInit() {
    this.updateTab();
  }

  protected loadData(tableLazyLoadEvent: any) {
    this.loading = true;
    this.specialMemberService.getSpecialMembers(FilterUtils.lazyEventToFilter(tableLazyLoadEvent))
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.specialMemberInfo = result.data;
          this.totalRecords = result.count;
        });
  }

  protected updateTab() {
    this.table().filter([this.tabValue], 'roles', 'custom');
    this.router.navigate([], {queryParams: {tab: this.tabValue}, replaceUrl: true});
  }
}
