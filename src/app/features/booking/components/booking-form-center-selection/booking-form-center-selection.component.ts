import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {
  centerIsAlwaysExclusive,
  ScoutCenter,
  ScoutCentersDropdown,
  ScoutCentersInfo
} from "../../constant/scout-center.constant";
import {DatePipe} from "@angular/common";
import {SelectModule} from "primeng/select";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessagesModule} from "primeng/messages";
import {PrimeTemplate} from "primeng/api";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {DateUtils} from "../../../../shared/util/date-utils";
import {BookingDateService} from "../../service/booking-date.service";
import {FormHelper} from "../../../../shared/util/form-helper";
import {map, Observable} from "rxjs";
import {BookingInterval} from "../../model/booking-interval.model";
import {CenterInformation} from "../../model/center-information.model";
import {BookingService} from "../../service/booking.service";
import {DatePicker} from "primeng/datepicker";

@Component({
  selector: 'app-booking-form-center-selection',
  imports: [
    DatePipe,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    KeyFilterModule,
    MessagesModule,
    PrimeTemplate,
    ReactiveFormsModule,
    DatePicker
  ],
  templateUrl: './booking-form-center-selection.component.html',
  styleUrl: './booking-form-center-selection.component.scss'
})
export class BookingFormCenterSelectionComponent implements OnInit {

  private bookingDateService = inject(BookingDateService);
  private bookingService = inject(BookingService);

  protected formHelper = new FormHelper();
  protected datesForm = new FormHelper();
  protected defaultDate: Date = DateUtils.dateTruncatedToHours(new Date());
  protected maxDate: Date = this.bookingDateService.getBookingDate();
  protected selectedCenterInfo!: CenterInformation;
  protected centerLoaded = false;
  protected noOverlapping = false;
  protected fullyOccupiedInfo: BookingInterval[] = [];
  protected occupiedInfo: BookingInterval[] = [];
  protected reservedInfo: BookingInterval[] = [];
  protected readonly scoutCenters = ScoutCentersDropdown;
  private centerIsAlwaysExclusive: boolean = false;

  @Output() onInit = new EventEmitter<FormGroup>();

  ngOnInit() {
    this.datesForm.createForm({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, {
      validators: this.dateValidation,
      asyncValidators: this.occupationValidation,
    });

    this.formHelper.createForm({
      packs: [null, [Validators.required, Validators.min(1), Validators.max(this.selectedCenterInfo?.maxCapacity)]],
      dates: this.datesForm.form,
      scoutCenter: [null, Validators.required]
    });
    this.onInit.emit(this.formHelper.form);
  }

  protected getDateClass(date: any) {
    return this.bookingDateService.getDateClass(date);
  }

  public loadCenterData() {
    const center: ScoutCenter = this.formHelper.controlValue('scoutCenter');
    this.selectedCenterInfo = ScoutCentersInfo[center];
    this.centerIsAlwaysExclusive = centerIsAlwaysExclusive(center);
    this.bookingDateService.loadDates(this.formHelper.controlValue('scoutCenter')).subscribe(() => {
      this.centerLoaded = true;
      this.datesForm.form.updateValueAndValidity();
    });
  }

  private dateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let startDate = control.get("startDate")?.value;
    let endDate = control.get("endDate")?.value;
    if (startDate && endDate) {
      startDate = DateUtils.dateTruncatedToMinutes(startDate);
      endDate = DateUtils.dateTruncatedToMinutes(endDate);
      if (endDate <= startDate) {
        this.resetOccupationInfo();
        return {endDateBefore: true};
      }
    }
    return null;
  };

  private occupationValidation: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    let startDate = control.get("startDate")!.value;
    let endDate = control.get("endDate")!.value;
    startDate = DateUtils.dateTruncatedToMinutes(startDate);
    endDate = DateUtils.dateTruncatedToMinutes(endDate);
    return this.checkBookingDates(startDate, endDate).pipe(
      map(result => {
        if (result) {
          this.fullyOccupiedInfo = result.filter(range => range.status == "FULLY_OCCUPIED");
          this.occupiedInfo = result.filter(range => range.status == "OCCUPIED");
          this.reservedInfo = result.filter(range => range.status == "RESERVED");
          this.noOverlapping = result.length == 0;
          const validDateRange = this.fullyOccupiedInfo.length == 0;
          if (!validDateRange) return {invalidDateRange: true};
        }
        return null;
      })
    );
  };

  private checkBookingDates(startDate: Date, endDate: Date) {
    return this.bookingService.checkBookingDates({
      startDate: DateUtils.toLocalDateTime(startDate),
      endDate: DateUtils.toLocalDateTime(endDate),
      scoutCenter: this.formHelper.controlValue('scoutCenter')
    });
  }

  private resetOccupationInfo() {
    this.fullyOccupiedInfo = [];
    this.occupiedInfo = [];
    this.reservedInfo = [];
    this.noOverlapping = false;
  }

  get eligibleForExclusiveness() {
    return this.occupiedInfo.length == 0 && this.reservedInfo.length == 0 && !this.centerIsAlwaysExclusive &&
      this.formHelper.controlValue("packs") >= this.selectedCenterInfo.exclusiveReservationCapacity;
  }

  get startDate() {
    return DateUtils.toLocalDateTime(this.datesForm.controlValue("startDate"));
  }

  get endDate() {
    return DateUtils.toLocalDateTime(this.datesForm.controlValue("endDate"));
  }

  get packs(): number {
    return this.formHelper.controlValue("packs");
  }

  get scoutCenter(): ScoutCenter {
    return this.formHelper.controlValue("scoutCenter");
  }

  get form(): FormGroup {
    return this.formHelper.form;
  }
}
