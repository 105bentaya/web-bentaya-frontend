import {Component, inject, OnInit} from '@angular/core';
import {TabsModule} from "primeng/tabs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ScoutService} from "../../services/scout.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {Scout} from "../../models/scout.model";
import {PersonalDataComponent} from "../scout-detail-tabs/personal-data/personal-data.component";
import {PersonalDataFormComponent} from "../scout-detail-forms/personal-data-form/personal-data-form.component";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ContactDataComponent} from "../scout-detail-tabs/contact-data/contact-data.component";
import {ContactDataFormComponent} from "../scout-detail-forms/contact-data-form/contact-data-form.component";
import {MedicalDataComponent} from "../scout-detail-tabs/medical-data/medical-data.component";
import {MedicalDataFormComponent} from "../scout-detail-forms/medical-data-form/medical-data-form.component";
import {GroupDataFormComponent} from "../scout-detail-forms/group-data-form/group-data-form.component";
import {GroupDataComponent} from "../scout-detail-tabs/group-data/group-data.component";
import {EconomicDataComponent} from "../scout-detail-tabs/economic-data/economic-data.component";
import {EconomicDataFormComponent} from "../scout-detail-forms/economic-data-form/economic-data-form.component";
import {CensusPipe} from "../../census.pipe";
import {AgePipe} from "../../age.pipe";
import {ScoutHistoryFormComponent} from "../scout-detail-forms/scout-history-form/scout-history-form.component";
import {ScoutHistoryComponent} from "../scout-detail-tabs/scout-history/scout-history.component";

@Component({
  selector: 'app-scout-detail',
  templateUrl: './scout-detail.component.html',
  styleUrls: ['./scout-detail.component.scss'],
  imports: [
    TabsModule,
    BasicLoadingInfoComponent,
    Tag,
    Button,
    PersonalDataComponent,
    PersonalDataFormComponent,
    ContactDataComponent,
    ContactDataFormComponent,
    MedicalDataComponent,
    MedicalDataFormComponent,
    GroupDataFormComponent,
    GroupDataComponent,
    EconomicDataComponent,
    EconomicDataFormComponent,
    CensusPipe,
    AgePipe,
    ScoutHistoryFormComponent,
    ScoutHistoryComponent,
    RouterLink
  ]
})
export class ScoutDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);

  protected scout!: Scout;
  protected editing: boolean = false;
  protected selectedTab: number;

  constructor() {
    const queryParam = +this.route.snapshot.queryParams['tab'];
    if (queryParam >= 0 && queryParam <= 7) {
      this.selectedTab = +queryParam;
    } else {
      this.selectedTab = +(localStorage.getItem("scout_tab") ?? 0);
    }
    this.updateQueryParam(this.selectedTab);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.scoutService.getById(id).subscribe(scout => this.scout = scout);
  }

  protected get scoutPersonalData() {
    return this.scout.personalData;
  }

  protected onEditionStop(updatedMember: void | Scout) {
    if (updatedMember) {
      this.alertService.sendBasicSuccessMessage("Scout actualizado con éxito");
      this.scout = updatedMember;
    }
    this.editing = false;
  }

  protected updateQueryParam(tab: number | string) {
    localStorage.setItem("scout_tab", JSON.stringify(tab));
    this.router.navigate([], {queryParams: {tab}, replaceUrl: true});
  }
}
