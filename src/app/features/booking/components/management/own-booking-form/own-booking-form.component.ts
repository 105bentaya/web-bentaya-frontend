import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  BookingFormCenterSelectionComponent
} from "../../booking-form-center-selection/booking-form-center-selection.component";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {CheckboxModule} from "primeng/checkbox";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {OwnBookingForm} from "../../../model/own-booking-form.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {BookingService} from "../../../service/booking.service";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {FloatLabel} from "primeng/floatlabel";
import {
  CheckboxContainerComponent
} from "../../../../../shared/components/checkbox-container/checkbox-container.component";
import {Select} from "primeng/select";
import {LoggedUserDataService} from "../../../../../core/auth/services/logged-user-data.service";

@Component({
  selector: 'app-own-booking-form',
  imports: [
    BookingFormCenterSelectionComponent,
    FormTextAreaComponent,
    CheckboxModule,
    ReactiveFormsModule,
    SaveButtonsComponent,
    FloatLabel,
    CheckboxContainerComponent,
    Select
  ],
  templateUrl: './own-booking-form.component.html',
  styleUrl: './own-booking-form.component.scss'
})
export class OwnBookingFormComponent implements OnInit {

  protected ref = inject(DynamicDialogRef);
  private readonly bookingService = inject(BookingService);
  private readonly alertService = inject(AlertService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly dialogConfig = inject(DynamicDialogConfig);

  @ViewChild('centerSelectionComponent')
  protected selectedCenterForm!: BookingFormCenterSelectionComponent;
  protected ownBookingForm = new FormHelper();
  protected loading = false;
  protected groups!: { id: number; name: string }[];

  ngOnInit() {
    if (this.dialogConfig.data?.groups) {
      this.groups = this.dialogConfig.data.groups;
    } else {
      this.groups = this.loggedUserData.getScouterDropdownGroups();
    }
    this.ownBookingForm.createForm({
      exclusiveReservation: [false],
      groupId: [null, Validators.required],
      observations: [null, [Validators.required, Validators.maxLength(256)]],
    });
  }

  protected submitForm() {
    this.ownBookingForm.validateAllWithAsync().then(isValid => {
      if (isValid) {
        this.saveOwnBooking();
      }
    });
  }

  private saveOwnBooking() {
    this.loading = true;
    const ownBooking: OwnBookingForm = {...this.ownBookingForm.value};
    ownBooking.startDate = this.selectedCenterForm.startDate;
    ownBooking.endDate = this.selectedCenterForm.endDate;
    ownBooking.packs = this.selectedCenterForm.packs;
    ownBooking.scoutCenterId = this.selectedCenterForm.scoutCenterId;
    this.bookingService.addOwnBooking(ownBooking).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Reserva guardada con éxito");
        this.ref.close(true);
      },
      error: () => this.loading = false
    });
  }

  protected addCenterControl(form: FormGroup) {
    this.ownBookingForm.form.addControl("center", form);
  }

  protected centerIsNotAlwaysExclusive() {
    return this.selectedCenterForm?.selectedCenterIsNotAlwaysExclusive;
  }
}
