import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {SpecialMemberService} from "../../special-member.service";
import {RouterLink} from "@angular/router";
import {SpecialMemberBasicData, specialMemberOptions} from "../../models/special-member.model";
import {CensusPipe} from "../../../scouts/census.pipe";
import {SpecialRolePipe} from "../../special-role.pipe";
import {MultiSelect} from "primeng/multiselect";
import {InputText} from "primeng/inputtext";
import FilterUtils from "../../../../shared/util/filter-utils";
import {finalize} from "rxjs";

@Component({
  selector: 'app-special-member-list',
  imports: [
    Button,
    TableModule,
    RouterLink,
    CensusPipe,
    SpecialRolePipe,
    MultiSelect,
    InputText
  ],
  templateUrl: './special-member-list.component.html',
  styleUrl: './special-member-list.component.scss'
})
export class SpecialMemberListComponent {

  private readonly specialMemberService = inject(SpecialMemberService);

  protected specialMemberInfo!: SpecialMemberBasicData[];
  protected loading = true;
  protected totalRecords!: number;

  protected readonly specialMemberOptions = specialMemberOptions;

  protected loadData(tableLazyLoadEvent: any) {
    this.loading = true;
    this.specialMemberService.getSpecialMembers(FilterUtils.lazyEventToFilter(tableLazyLoadEvent))
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.specialMemberInfo = result.data;
          this.totalRecords = result.count;
        });
  }
}
