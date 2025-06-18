import {Component, inject, OnInit} from '@angular/core';
import {DonationTypePipe} from "../../donation-type.pipe";
import {TableModule} from 'primeng/table';
import {Tab, TabList, Tabs} from "primeng/tabs";
import {DonationFormListComponent} from "../donation-form-list/donation-form-list.component";
import {ActivatedRoute, Router} from "@angular/router";
import {isNaN} from "lodash";
import {DonationListComponent} from "../donation-list/donation-list.component";
import {FeesListComponent} from "../fees-list/fees-list.component";
import {SpecialMemberService} from "../../../special-member/special-member.service";
import {SpecialMemberDonation} from "../../../special-member/models/special-member.model";
import {EconomicEntry} from "../../../scouts/models/scout.model";

@Component({
  selector: 'app-donation-management',
  templateUrl: './donation-management.component.html',
  styleUrls: ['./donation-management.component.scss'],
  providers: [DonationTypePipe],
  imports: [
    TableModule,
    Tab,
    TabList,
    Tabs,
    DonationFormListComponent,
    DonationListComponent,
    FeesListComponent
  ]
})
export class DonationManagementComponent implements OnInit {
  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected selectedTab = 0;
  protected donations: SpecialMemberDonation[] = [];

  constructor() {
    let tabQueryParam = +this.route.snapshot.queryParams['tab'];
    if (isNaN(tabQueryParam)) {
      tabQueryParam = +localStorage.getItem("donation_tab")!;
    }
    if (isNaN(tabQueryParam) || tabQueryParam < 0 || tabQueryParam > 2) {
      this.selectedTab = 0;
    } else {
      this.selectedTab = tabQueryParam;
    }
    this.updateTab();
  }

  ngOnInit() {
    this.specialMemberService.getDonations().subscribe(res => this.donations = res);
  }

  protected updateTab() {
    localStorage.setItem("donation_tab", JSON.stringify(this.selectedTab));
    this.router.navigate([], {queryParams: {tab: this.selectedTab}, replaceUrl: true});
  }
}
