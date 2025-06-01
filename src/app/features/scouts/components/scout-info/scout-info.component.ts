import {Component, inject, OnInit} from '@angular/core';
import {TabsModule} from "primeng/tabs";
import {ActivatedRoute} from "@angular/router";
import {ScoutService} from "../../services/scout.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {Scout} from "../../models/scout.model";
import {PersonalDataComponent} from "../personal-data/personal-data.component";
import {PersonalDataFormComponent} from "../personal-data-form/personal-data-form.component";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ContactDataComponent} from "../contact-data/contact-data.component";
import {ContactDataFormComponent} from "../contact-data-form/contact-data-form.component";
import {MedicalDataComponent} from "../medical-data/medical-data.component";
import {MedicalDataFormComponent} from "../medical-data-form/medical-data-form.component";
import {GroupDataFormComponent} from "../group-data-form/group-data-form.component";
import {GroupDataComponent} from "../group-data/group-data.component";
import {Location} from "@angular/common";
import {EconomicDataComponent} from "../economic-data/economic-data.component";
import {EconomicDataFormComponent} from "../economic-data-form/economic-data-form.component";

@Component({
  selector: 'app-scout-info',
  templateUrl: './scout-info.component.html',
  styleUrls: ['./scout-info.component.scss'],
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
    EconomicDataFormComponent
  ]
})
export class ScoutInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);
  protected readonly location = inject(Location);

  protected scout!: Scout;
  protected editing: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.scoutService.getById(id).subscribe(scout => this.scout = scout);
  }

  get scoutPersonalData() {
    return this.scout.personalData;
  }

  onEditionStop(updatedMember: void | Scout) {
    if (updatedMember) {
      this.alertService.sendBasicSuccessMessage("Scout actualizado con éxito");
      this.scout = updatedMember;
    }
    this.editing = false;
  }
}
