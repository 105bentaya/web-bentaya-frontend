import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {SelectModule} from "primeng/select";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
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
import {BookingDateAndStatus} from "../../model/booking-date-and-status.model";
import {BookingService} from "../../service/booking.service";
import {DatePicker} from "primeng/datepicker";
import {Message} from "primeng/message";
import {ScoutCenterService} from "../../../scout-center/scout-center.service";
import {ScoutCenter} from '../../../scout-center/scout-center.model';
import {centerIsAlwaysExclusive} from "../../model/booking.model";

@Component({
  selector: 'app-booking-form-center-selection',
  imports: [
    DatePipe,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    KeyFilterModule,
    ReactiveFormsModule,
    DatePicker,
    Message
  ],
  templateUrl: './booking-form-center-selection.component.html',
  styleUrl: './booking-form-center-selection.component.scss'
})
export class BookingFormCenterSelectionComponent implements OnInit {

  private readonly bookingDateService = inject(BookingDateService);
  private readonly bookingService = inject(BookingService);
  private readonly scoutCenterService = inject(ScoutCenterService);

  protected formHelper = new FormHelper();
  protected datesForm = new FormHelper();
  protected defaultDate: Date = DateUtils.dateTruncatedToHours(new Date());
  protected maxDate!: Date;
  protected selectedCenterInfo!: ScoutCenter;
  protected scoutCenters!: ScoutCenter[];
  protected centerLoaded = false;
  protected noOverlapping = false;
  protected fullyOccupiedInfo: BookingDateAndStatus[] = [];
  protected occupiedInfo: BookingDateAndStatus[] = [];
  protected reservedInfo: BookingDateAndStatus[] = [];
  private centerIsAlwaysExclusive: boolean = false;

  @Output() onInit = new EventEmitter<FormGroup>();

  constructor() {
    this.bookingDateService.getBookingDate().then(date => this.maxDate = date);
  }

  ngOnInit() {
    this.scoutCenterService.getAll().subscribe(result => this.scoutCenters = result);
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
      scoutCenterId: [null, Validators.required]
    });
    this.onInit.emit(this.formHelper.form);
  }

  protected getDateClass(date: any) {
    return this.bookingDateService.getDateClass(date);
  }

  public loadCenterData() {
    const centerId: number = this.formHelper.controlValue('scoutCenterId');
    this.selectedCenterInfo = this.scoutCenters.find(center => center.id === centerId)!;
    this.centerIsAlwaysExclusive = centerIsAlwaysExclusive(this.selectedCenterInfo);
    this.bookingDateService.loadDates(this.formHelper.controlValue('scoutCenterId')).subscribe(() => {
      this.centerLoaded = true;
      this.datesForm.form.updateValueAndValidity();
    });
  }

  private readonly dateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
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

  private readonly occupationValidation: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    let startDate = control.get("startDate")!.value;
    let endDate = control.get("endDate")!.value;
    startDate = DateUtils.dateTruncatedToMinutes(startDate);
    endDate = DateUtils.dateTruncatedToMinutes(endDate);
    return this.checkBookingDates(startDate, endDate).pipe(
      map(result => {
        if (result) {
          this.fullyOccupiedInfo = result.filter(range => range.status == "OCCUPIED" && range.fullyOccupied);
          this.occupiedInfo = result.filter(range => range.status == "OCCUPIED" && !range.fullyOccupied);
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
      scoutCenterId: this.formHelper.controlValue('scoutCenterId')
    });
  }

  private resetOccupationInfo() {
    this.fullyOccupiedInfo = [];
    this.occupiedInfo = [];
    this.reservedInfo = [];
    this.noOverlapping = false;
  }

  get selectedCenterIsNotAlwaysExclusive() {
    return this.selectedCenterInfo && !this.centerIsAlwaysExclusive;
  }

  get eligibleForExclusiveness() {
    return this.occupiedInfo.length == 0 && this.reservedInfo.length == 0 && !this.centerIsAlwaysExclusive &&
      this.formHelper.controlValue("packs") >= this.selectedCenterInfo?.minExclusiveCapacity;
  }

  get selectedCenterName() {
    return this.selectedCenterInfo.name;
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

  get scoutCenterId(): number {
    return this.formHelper.controlValue("scoutCenterId");
  }

  get form(): FormGroup {
    return this.formHelper.form;
  }
}
