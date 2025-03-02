import {Component, inject, OnInit} from '@angular/core';
import {Scout} from "../../models/scout.model";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ScoutService} from "../../services/scout.service";
import {MenuItem} from "primeng/api";
import {GroupPipe} from '../../../../shared/pipes/group.pipe';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-scout-info',
  templateUrl: './scout-info.component.html',
  styleUrls: ['./scout-info.component.scss'],
  imports: [
    TabViewModule,
    GroupPipe,
    TabMenuModule,
    BasicLoadingInfoComponent,
    DatePipe
  ]
})
export class ScoutInfoComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  protected scouts!: Scout[];
  protected isUser = false;
  protected items!: MenuItem[];
  protected currentIndex = 0;

  ngOnInit(): void {
    if (this.config.data) {
      this.scouts = [this.config.data];
    } else {
      //mensajito
    }
  }

  private generateMenuItems(scouts: Scout[]) {
    this.items = scouts
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(scout => ({label: scout.name, command: () => this.currentIndex = scouts.indexOf(scout)}));
  }
}
