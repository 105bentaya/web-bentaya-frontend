import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  BookingFormCenterSelectionComponent
} from "../booking-form-center-selection/booking-form-center-selection.component";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {CheckboxModule} from "primeng/checkbox";
import {FormHelper} from "../../../../shared/util/form-helper";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {OwnBookingForm} from "../../model/own-booking-form.model";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {BookingService} from "../../service/booking.service";
import {AlertService} from "../../../../shared/services/alert-service.service";

@Component({
  selector: 'app-own-booking-form',
  imports: [
    BookingFormCenterSelectionComponent,
    FormTextAreaComponent,
    CheckboxModule,
    ReactiveFormsModule,
    SaveButtonsComponent
  ],
  templateUrl: './own-booking-form.component.html',
  styleUrl: './own-booking-form.component.scss'
})
export class OwnBookingFormComponent implements OnInit {

  protected ref = inject(DynamicDialogRef);
  protected bookingService = inject(BookingService);
  protected alertService = inject(AlertService);

  @ViewChild('centerSelectionComponent')
  protected selectedCenterForm!: BookingFormCenterSelectionComponent;
  protected ownBookingForm = new FormHelper();
  protected loading = false;

  ngOnInit() {
    this.ownBookingForm.createForm({
      exclusiveReservation: [false],
      observations: [null, [Validators.required, Validators.maxLength(256)]],
    });
  }

  protected submitForm() {
    this.ownBookingForm.validateAll();
    if (this.ownBookingForm.valid) {
      this.saveOwnBooking();
    }
  }

  private saveOwnBooking() {
    this.loading = true;
    const ownBooking: OwnBookingForm = {...this.ownBookingForm.value};
    ownBooking.startDate = this.selectedCenterForm.startDate;
    ownBooking.endDate = this.selectedCenterForm.endDate;
    ownBooking.packs = this.selectedCenterForm.packs;
    ownBooking.scoutCenter = this.selectedCenterForm.scoutCenter;
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
}
