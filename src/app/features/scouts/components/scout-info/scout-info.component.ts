import {Component, inject, OnInit} from '@angular/core';
import {Scout} from "../../models/scout.model";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {DatePipe} from "@angular/common";
import {TabsModule} from "primeng/tabs";

@Component({
  selector: 'app-scout-info',
  templateUrl: './scout-info.component.html',
  styleUrls: ['./scout-info.component.scss'],
  imports: [
    TabsModule,
    DatePipe
  ]
})
export class ScoutInfoComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  protected scout!: Scout;

  ngOnInit(): void {
    this.scout = this.config.data;
  }
}
