import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {FormTextAreaComponent} from '../../../../../shared/components/form-text-area/form-text-area.component';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {CurrencyPipe, NgClass} from '@angular/common';
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Booking, bookingIsAlwaysExclusive} from "../../../model/booking.model";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {InputText} from "primeng/inputtext";
import {HourPipe} from "../../../../../shared/pipes/hour.pipe";
import {SelectButton} from "primeng/selectbutton";

@Component({
  selector: 'app-booking-status-update',
  templateUrl: './booking-status-update.component.html',
  styleUrls: ['./booking-status-update.component.scss'],
  imports: [
    NgClass,
    FloatLabelModule,
    InputNumberModule,
    FormsModule,
    FormTextAreaComponent,
    SaveButtonsComponent,
    ReactiveFormsModule,
    InputText,
    SelectButton
  ]
})
export class BookingStatusUpdateComponent implements OnInit {

  protected ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly formHelper = new FormHelper();
  protected readonly exclusiveOptions = [
    {label: 'Sí', value: true},
    {label: 'No', value: false}
  ];

  protected confirmMessage: string = "¿Desea confirmar los datos actuales?";
  protected textAreaLabel: string = "Observaciones";
  protected textRequired: boolean = false;
  protected showPrice: boolean = false;
  protected message: string | undefined;
  protected recommendedPrice!: number;
  protected recommendedPriceText!: string;
  protected realPrice!: number;
  protected realPriceText: string | undefined;
  protected showExclusiveness: boolean | undefined;
  protected exclusivenessRequested: boolean | undefined;
  protected showSubject = false;
  protected realDays!: string;
  protected billableDays!: number;

  ngOnInit(): void {
    this.textAreaLabel = this.config.data.textAreaLabel;
    this.textRequired = this.config.data.textRequired;
    if (this.config.data.confirmMessage) this.confirmMessage = this.config.data.confirmMessage;

    this.message = this.config.data.message;

    this.showExclusiveness = this.config.data.showExclusiveness && !bookingIsAlwaysExclusive(this.config.data.booking);
    if (this.showExclusiveness) this.exclusivenessRequested = this.config.data.booking.exclusiveReservation;

    this.showSubject = this.config.data.showSubject;

    this.showPrice = this.config.data.showPrice;
    if (this.showPrice) this.calculateRecommendedPrice();
    this.buildForm();
  }

  protected buildForm() {
    this.formHelper.createForm({
      observations: [null, this.observationsValidators()]
    });
    if (this.showPrice) this.formHelper.form.addControl("price", new FormControl(null, [Validators.required, Validators.min(0)]));
    if (this.showExclusiveness) this.formHelper.form.addControl("exclusive", new FormControl(null, [Validators.required]));
    if (this.showSubject) this.formHelper.form.addControl("subject", new FormControl(null, [Validators.required, Validators.maxLength(63)]));
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.confirmationService.confirm({
        message: this.confirmMessage,
        accept: () => this.ref.close(this.formHelper.value)
      });
    }
  }

  protected disableUpdateButton() {
    return false;
  }

  private calculateRecommendedPrice() {
    const booking: Booking = this.config.data.booking;
    this.recommendedPrice = booking.billableDays * booking.scoutCenter.price / 100 * booking.packs;
    const priceCalculation = new CurrencyPipe('es', 'EUR').transform(this.recommendedPrice);
    const scoutCenterPrice = new CurrencyPipe('es', 'EUR').transform(booking.scoutCenter.price / 100);
    this.realDays = new HourPipe().transform(booking.minutes, true);
    this.billableDays = booking.billableDays;
    this.recommendedPriceText = `${booking.billableDays} días × ${booking.packs}pax × ${scoutCenterPrice} = ${priceCalculation} - Según días calculados`;

    const realDaysAsNumbers = Math.round(booking.minutes / (60 * 24));
    if (realDaysAsNumbers !== this.billableDays) {
      this.realPrice = realDaysAsNumbers * booking.scoutCenter.price / 100 * booking.packs;
      const realPriceCalculation = new CurrencyPipe('es', 'EUR').transform(this.realPrice);
      this.realPriceText = `${realDaysAsNumbers} días × ${booking.packs}pax × ${scoutCenterPrice} = ${realPriceCalculation} - Según días reales redondeados`;
    }
  }

  private observationsValidators() {
    const validators = [Validators.maxLength(2047)];
    if (this.textRequired) validators.push(Validators.required);
    if (this.showExclusiveness) validators.push(this.exclusivenessRejectedValidator);
    return validators;
  }

  get exclusivenessRejected(): boolean {
    return !!(this.showExclusiveness && this.exclusivenessRequested && this.formHelper.controlValue("exclusive") === false);
  }

  private readonly exclusivenessRejectedValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.exclusivenessRejected && (!control.value || control.value.length < 1) ? {required: true} : null;
  };

  protected setPrice(recommendedPrice: number) {
    this.formHelper.get("price")?.setValue(recommendedPrice);
  }
}
