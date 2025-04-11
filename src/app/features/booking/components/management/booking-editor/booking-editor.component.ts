import {Component, inject, input, output} from '@angular/core';
import {Booking, centerIsAlwaysExclusive} from "../../../model/booking.model";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {ScoutCenter} from "../../../../scout-center/scout-center.model";
import {Select} from "primeng/select";
import {ScoutCenterService} from "../../../../scout-center/scout-center.service";
import {KeyFilter} from "primeng/keyfilter";
import {DatePicker} from "primeng/datepicker";
import {Checkbox} from "primeng/checkbox";
import {
  CheckboxContainerComponent
} from "../../../../../shared/components/checkbox-container/checkbox-container.component";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {InputNumber} from "primeng/inputnumber";
import {Status} from "../../../constant/status.constant";
import {BookingStatusService} from "../../../service/booking-status.service";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-booking-editor',
  imports: [
    SaveButtonsComponent,
    ReactiveFormsModule,
    FloatLabel,
    InputText,
    Select,
    KeyFilter,
    DatePicker,
    Checkbox,
    CheckboxContainerComponent,
    InputNumber
  ],
  templateUrl: './booking-editor.component.html',
  styleUrl: './booking-editor.component.scss'
})
export class BookingEditorComponent {

  private readonly scoutCenterService = inject(ScoutCenterService);
  private readonly bookingService = inject(BookingStatusService);
  private readonly alertService = inject(AlertService);
  protected helper = new FormHelper();

  editing = input.required<boolean>();
  cancelEdition = output();
  bookingEdited = output();
  protected booking!: Booking;

  protected scoutCenters!: ScoutCenter[];
  protected selectedCenterInfo!: ScoutCenter;

  protected readonly centerIsAlwaysExclusive = centerIsAlwaysExclusive;
  protected showPrice = false;
  protected loading = false;

  constructor() {
    this.scoutCenterService.getAll().subscribe(result => this.scoutCenters = result);
  }

  initEdition(booking: Booking) {
    this.booking = booking;
    this.helper.createForm({
      exclusiveReservation: [booking.exclusiveReservation],
      packs: [booking.packs, [Validators.required, Validators.min(1), Validators.max(this.selectedCenterInfo?.maxCapacity)]],
      scoutCenterId: [booking.scoutCenter.id, Validators.required],
      startDate: [new Date(booking.startDate), [Validators.required, this.dateValidation]],
      endDate: [new Date(booking.endDate), [Validators.required, this.dateValidation]]
    });
    this.loadCenterData();

    this.showPrice = !booking.isOwnBooking && (this.booking.status == Status.OCCUPIED || this.booking.status == Status.RESERVED);

    if (!booking.isOwnBooking) {
      this.helper.form.addControl("groupName", new FormControl(booking.organizationName, Validators.required));
      this.helper.form.addControl("cif", new FormControl(booking.cif, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]));
    }
    if (this.showPrice) {
      this.helper.form.addControl("price", new FormControl(booking.price, [Validators.required, Validators.min(1)]));
    }
  }

  private readonly dateValidation: ValidatorFn = (): ValidationErrors | null => {
    let startDate = this.helper.controlValue("startDate");
    let endDate = this.helper.controlValue("endDate");

    if (startDate && endDate) {
      startDate = DateUtils.dateTruncatedToMinutes(startDate);
      endDate = DateUtils.dateTruncatedToMinutes(endDate);
      if (endDate <= startDate) {
        return {endDateBefore: true};
      }
    }
    return null;
  };

  protected loadCenterData() {
    const centerId: number = this.helper.controlValue('scoutCenterId');
    this.selectedCenterInfo = this.scoutCenters.find(center => center.id === centerId)!;
  }

  protected submitForm() {
    if (this.helper.validateAll()) {
      const updatedBooking = {...this.helper.value};
      updatedBooking.startDate = DateUtils.toLocalDateTime(updatedBooking.startDate);
      updatedBooking.endDate = DateUtils.toLocalDateTime(updatedBooking.endDate);
      this.loading = true;
      this.bookingService.updateBooking(this.booking.id, !!this.booking.isOwnBooking, updatedBooking)
        .pipe(finalize(() => this.loading = false))
        .subscribe(() => {
          this.alertService.sendBasicSuccessMessage("Reserva editada con éxito");
          this.bookingEdited.emit();
        });
    }
  }
}
