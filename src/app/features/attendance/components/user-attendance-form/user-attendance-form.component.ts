import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "../../services/confirmation.service";
import {Confirmation} from "../../models/confirmation.model";
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FloatLabel} from "primeng/floatlabel";
import {yesNoOptions} from "../../../../shared/constant";

@Component({
  selector: 'app-user-attendance-form',
  templateUrl: './user-attendance-form.component.html',
  styleUrls: ['./user-attendance-form.component.scss'],
  imports: [
    SelectButtonModule,
    FormsModule,
    FormTextAreaComponent,
    SaveButtonsComponent,
    BasicLoadingInfoComponent,
    FloatLabel
  ]
})
export class UserAttendanceFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly confirmationService = inject(ConfirmationService);
  
  protected readonly options = yesNoOptions;
  protected confirmation!: Confirmation;
  protected validText: boolean = true;
  protected loading: boolean = false;

  ngOnInit(): void {
    if (this.config.data?.eventId && this.config.data?.scoutId) {
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
