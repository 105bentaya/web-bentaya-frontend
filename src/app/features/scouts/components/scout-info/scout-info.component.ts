import {Component, inject, OnInit} from '@angular/core';
import {Scout} from "../../models/scout.model";
import {Location} from "@angular/common";
import {TabsModule} from "primeng/tabs";
import {ActivatedRoute} from "@angular/router";
import {ScoutService} from "../../services/scout.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Tag} from "primeng/tag";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {Button} from "primeng/button";

@Component({
  selector: 'app-scout-info',
  templateUrl: './scout-info.component.html',
  styleUrls: ['./scout-info.component.scss'],
  imports: [
    TabsModule,
    BasicLoadingInfoComponent,
    Tag,
    GeneralAButtonComponent,
    Button
  ]
})
export class ScoutInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly scoutService = inject(ScoutService);
  private readonly location = inject(Location);

  protected scout!: Scout;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.scoutService.getById(id).subscribe(scout => this.scout = scout);
  }

  goBack() {
    this.location.back();
  }
}
