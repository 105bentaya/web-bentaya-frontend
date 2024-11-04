import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "../../services/confirmation.service";
import {Confirmation} from "../../models/confirmation.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.scss'],
  standalone: true,
  imports: [
    SelectButtonModule,
    FormsModule,
    FormTextAreaComponent,
    SaveButtonsComponent,
    BasicLoadingInfoComponent
  ]
})
export class AttendanceFormComponent implements OnInit {

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private alertService = inject(AlertService);

  protected options = [{label: 'Sí', value: true}, {label: 'No', value: false}];
  protected confirmation!: Confirmation;
  protected validText: boolean = true;
  protected loading: boolean = false;

  ngOnInit(): void {
    if (this.config.data && this.config.data.eventId && this.config.data.scoutId) {
      this.confirmationService.getById(this.config.data.scoutId, this.config.data.eventId).subscribe({
        next: data => {
          this.confirmation = data;
        },
        error: () => this.ref.close()
      });
    }
  }

  protected onSubmit() {
    this.loading = true;
    this.confirmationService.updateByUser(this.confirmation).subscribe({
      next: value => {
        this.ref.close(value);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
