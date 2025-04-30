import {Component, input} from '@angular/core';
import {Scout} from "../../models/member.model";
import {BasicInfoComponent} from "../basic-info/basic-info.component";

@Component({
  selector: 'app-group-data',
  imports: [
    BasicInfoComponent
  ],
  templateUrl: './group-data.component.html',
  styleUrl: './group-data.component.scss'
})
export class GroupDataComponent {
  scout = input.required<Scout>();

  get section(): string {
    const scoutInfo = this.scout().scoutInfo;
    switch (scoutInfo.scoutType) {
      case "PARTICIPANT":
        return scoutInfo.group!.section!;
      case "SCOUT":
        return "Scouter";
      case "COMMITTEE":
      case "MANAGER":
        return "Scoutsupport";
      case "INACTIVE":
        return "-";
    }
  }

  get group(): string {
    const scoutInfo = this.scout().scoutInfo;
    switch (scoutInfo.scoutType) {
      case "PARTICIPANT":
        return scoutInfo.group!.name;
      case "SCOUT":
        return "Kraal";
      case "COMMITTEE":
        return "Almogaren";
      case "MANAGER":
        return "Tagoror";
      case "INACTIVE":
        return "Guatatiboa";
    }
  }
}
