import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {BookingService} from "../../service/booking.service";
import {BookingForm} from "../../model/booking-form.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {Booking} from "../../model/booking.model";
import {CheckboxModule} from 'primeng/checkbox';
import {KeyFilterModule} from 'primeng/keyfilter';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {InputTextModule} from 'primeng/inputtext';
import {DatePipe, NgClass} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {RouterLink} from '@angular/router';
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  LargeFormButtonsComponent
} from "../../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {
  BookingFormCenterSelectionComponent
} from "../booking-form-center-selection/booking-form-center-selection.component";
import {maintenanceEmail} from "../../../../shared/constant";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {UserRole} from "../../../users/models/role.model";
import {BookingDateService} from "../../service/booking-date.service";
import {BookingFetcherService} from "../../service/booking-fetcher.service";
import {Button} from "primeng/button";
import {finalize} from "rxjs";
import {Select} from "primeng/select";

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  imports: [
    RouterLink,
    StepsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    FormTextAreaComponent,
    KeyFilterModule,
    CheckboxModule,
    BookingFormCenterSelectionComponent,
    BasicLoadingInfoComponent,
    NgClass,
    LargeFormButtonsComponent,
    DatePipe,
    CheckboxContainerComponent,
    GeneralAButtonComponent,
    Button,
    Select,
    FormsModule
  ]
})
export class BookingFormComponent implements OnInit {

  private readonly bookingService = inject(BookingService);
  private readonly bookingFetcherService = inject(BookingFetcherService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly loggedUserData = inject(LoggedUserDataService);

  protected steps: MenuItem[] = [
    {label: 'Datos de la Entidad'},
    {label: 'Contacto'},
    {label: 'Datos de la Reserva'},
    {label: 'Otros Datos'},
    {label: 'Confirmación'}
  ];
  protected successOnSubmit = false;
  protected noWhiteSpaceFilter = /\S/;
  protected loading = false;
  protected bookingForm = new FormHelper();
  protected currentUser!: string;
  protected booking!: BookingForm;
  protected mail!: string;
  @ViewChild('centerSelection')
  protected centerSelectionComponent!: BookingFormCenterSelectionComponent;
  protected readonly maintenanceEmail = maintenanceEmail;
  protected maxDate!: Date;

  private bookingsToSelect: Booking[] | undefined;
  protected bookingOptions: { value: number; name: string }[] | undefined;
  protected selectedBookingId: number = 0;
  protected infoLoaded = false;

  constructor() {
    inject(BookingDateService).getBookingDate().then(date => this.maxDate = date);
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.currentUser = this.loggedUserData.getUsername();
    }
    if (this.loggedUserData.hasRequiredPermission(UserRole.SCOUT_CENTER_REQUESTER)) {
      this.bookingFetcherService.getLatestByCurrentUser()
        .pipe(finalize(() => this.infoLoaded = true))
        .subscribe(userBookings => this.loadUserBookings(userBookings));
    } else {
      this.infoLoaded = true;
    }
  }

  private loadUserBookings(userBookings: Booking[]) {
    this.bookingsToSelect = userBookings;
    this.selectedBookingId = userBookings[0].id;
    this.bookingOptions = userBookings.map(booking => ({
      name: `${booking.organizationName} - ${booking.cif}`,
      value: booking.id
    }));
    this.bookingOptions.unshift({
      name: "Nueva Reserva",
      value: 0
    });
  }

  protected startForm() {
    if (!this.bookingForm.form) {
      this.initializeForm(this.bookingsToSelect?.find(booking => booking.id === this.selectedBookingId));
    } else {
      this.bookingForm.goToFirstPage();
    }
  }

  private initializeForm(booking?: Booking) {
    this.bookingForm.goToFirstPage();
    this.bookingForm.createForm({
      groupName: [booking?.organizationName, Validators.required],
      cif: [booking?.cif, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      groupDescription: [booking?.groupDescription, [Validators.required, Validators.maxLength(510)]],
      facilityUse: [null, [Validators.required, Validators.maxLength(2000)]],
      contactName: [booking?.contactName, Validators.required],
      relationship: [booking?.contactRelationship, Validators.required],
      email: [this.currentUser, [Validators.required, Validators.email]],
      phone: [booking?.contactPhone, Validators.required],
      observations: [null, Validators.maxLength(1023)],
      exclusiveReservation: [false],
      privacy: [false, Validators.requiredTrue],
    });
    this.bookingForm.setPages([
      ["cif", "groupName", "facilityUse", "groupDescription"],
      ["contactName", "relationship", "email", "phone"],
      ["centerSelection"],
      ["privacy", "observations"]
    ]);
    this.bookingForm.onLastPage = () => {
      this.booking = this.bookingForm.value;
      this.booking.cif = this.booking.cif.toUpperCase();
      this.booking.startDate = this.centerSelectionComponent.startDate;
      this.booking.endDate = this.centerSelectionComponent.endDate;
      this.booking.packs = this.centerSelectionComponent.packs;
      this.booking.scoutCenterId = this.centerSelectionComponent.scoutCenterId;
    };
  }

  protected sendForm() {
    this.alertService.sendMessage({
      title: "Enviando...",
      message: "Esto puede tardar unos segundos",
      severity: "info"
    });
    this.loading = true;
    this.mail = this.booking.email;
    this.bookingService.sendForm(this.booking).subscribe({
      next: () => {
        this.successOnSubmit = true;
        this.alertService.sendBasicSuccessMessage("La reserva se ha realizado con éxito");
        this.loading = false;
      },
      error: () => {
        this.centerSelectionComponent.loadCenterData();
        this.loading = false;
      }
    });
  }

  protected addCenterControl(form: FormGroup) {
    this.bookingForm.form.addControl("centerSelection", form);
  }
}
