import {Component, inject, OnInit} from '@angular/core';
import {TabsModule} from "primeng/tabs";
import {ActivatedRoute} from "@angular/router";
import {ScoutService} from "../../services/scout.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {Member, RealPersonalData} from "../../models/member.model";
import {PersonalDataComponent} from "../personal-data/personal-data.component";
import {PersonalDataFormComponent} from "../personal-data-form/personal-data-form.component";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ContactDataComponent} from "../contact-data/contact-data.component";
import {ContactDataFormComponent} from "../contact-data-form/contact-data-form.component";

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
    ContactDataFormComponent
  ]
})
export class ScoutInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);

  protected scout!: Member;
  protected editing: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.scoutService.getById(id).subscribe(scout => this.scout = scout);
  }

  get scoutPersonalData() {
    return this.scout.personalData as RealPersonalData;
  }

  onEditionStop(updatedMember: void | Member) {
    if (updatedMember) {
      this.alertService.sendBasicSuccessMessage("Scout actualizado con éxito");
      this.scout = updatedMember;
    }
    this.editing = false;
  }
}
