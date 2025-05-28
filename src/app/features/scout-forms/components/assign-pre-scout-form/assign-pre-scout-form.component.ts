import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {adminStatuses, statuses} from "../../models/satus.model";
import {BasicGroupForm} from "../../../../shared/model/group.model";
import {PreScout} from "../../models/pre-scout.model";
import {PreScoutAssignation} from "../../models/pre-scout-assignation.model";
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {FormsModule} from '@angular/forms';
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Select} from "primeng/select";
import {GroupService} from "../../../../shared/services/group.service";

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
  protected groupService = inject(GroupService);

  protected statuses = statuses;
  protected groups!: BasicGroupForm[];

  protected canEditGroup = false;

  protected groupId: number | undefined;
  protected status: number | undefined;
  protected comment: string | undefined;

  private preScout!: PreScout;

  ngOnInit(): void {
    this.groupService.getBasicGroups({uppercase: true}).subscribe(groups => this.groups = groups);
    if (this.config.data.preScout) {
      this.preScout = this.config.data.preScout;
      this.groupId = this.preScout.assignation?.group?.id;
      this.status = this.preScout.assignation?.status;
      this.comment = this.preScout.assignation?.comment;
    } else {
      this.ref.close();
    }
    if (this.config.data.canEditGroup) {
      this.canEditGroup = true;
      this.statuses = adminStatuses.slice();
      this.status = this.preScout.assignation?.status ?? 0;
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
      const groupId = this.canEditGroup ? this.groupId : this.preScout.assignation!.group.id;
      const result: PreScoutAssignation = {
        preScoutId: this.preScout.id!,
        status: this.status,
        comment: this.comment,
        group: {id: groupId}
      };
      this.ref.close(result);
    }
  }
}
