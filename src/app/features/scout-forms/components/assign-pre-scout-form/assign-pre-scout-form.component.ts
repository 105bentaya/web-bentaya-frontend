import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {adminStatuses, statuses} from "../../models/satus.model";
import {unitGroups} from "../../../../shared/model/group.model";
import {PreScout} from "../../models/pre-scout.model";
import {PreScoutAssignation} from "../../models/pre-scout-assignation.model";
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {FormsModule} from '@angular/forms';
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Select} from "primeng/select";

@Component({
  selector: 'app-assign-pre-scout-form',
  templateUrl: './assign-pre-scout-form.component.html',
  styleUrls: ['./assign-pre-scout-form.component.scss'],
  imports: [
    FloatLabelModule,
    FormsModule,
    FormTextAreaComponent,
    SaveButtonsComponent,
    Select
  ]
})
export class AssignPreScoutFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  protected ref = inject(DynamicDialogRef);

  protected statuses = statuses;
  protected groups = unitGroups;

  protected canEditGroup = false;

  protected groupId!: number;
  protected status!: number;
  protected comment!: string;

  private preScout!: PreScout;

  ngOnInit(): void {
    if (this.config.data.preScout) {
      this.preScout = this.config.data.preScout;
      this.groupId = this.preScout.groupId!;
      this.status = this.preScout.status!;
      this.comment = this.preScout.assignationComment!;
    } else {
      this.ref.close();
    }
    if (this.config.data.canEditGroup) {
      this.canEditGroup = true;
      this.statuses = adminStatuses.slice();
      this.status = this.preScout.status ?? 0;
      if (!this.groupId) this.setGroup();
    }
  }

  private setGroup() {
    this.statuses.pop();
    switch (this.preScout.section) {
      case "CASTOR":
        this.groupId = 1;
        break;
      case "ESCULTA":
        this.groupId = 6;
        break;
      case "ROVER":
        this.groupId = 7;
        break;
    }
  }

  protected submit() {
    if (this.status != null && this.groupId != null) {
      const result: PreScoutAssignation = {
        preScoutId: this.preScout.id!,
        status: this.status,
        comment: this.comment,
        groupId: 0
      };
      result.groupId = this.canEditGroup ? this.groupId : this.preScout.groupId!;
      this.ref.close(result);
    }
  }
}
