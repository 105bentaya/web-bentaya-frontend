import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {BookingService} from "../../service/booking.service";
import {BookingForm} from "../../model/booking-form.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {Booking} from "../../model/booking.model";
import {LoggedUserInformationService} from "../../../../core/auth/services/logged-user-information.service";
import {ScoutCenterPipe} from '../../pipe/scout-center.pipe';
import {CheckboxModule} from 'primeng/checkbox';
import {KeyFilterModule} from 'primeng/keyfilter';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {InputTextModule} from 'primeng/inputtext';
import {DatePipe, NgClass} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {RouterLink} from '@angular/router';
import {FormHelper} from "../../../../shared/util/form-helper";
import {LargeFormButtonsComponent} from "../../../../shared/components/large-form-buttons/large-form-buttons.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {
  PrivacyCheckboxContainerComponent
} from "../../../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";
import {BookingBetaAlertComponent} from "../booking-beta-alert/booking-beta-alert.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {
  BookingFormCenterSelectionComponent
} from "../booking-form-center-selection/booking-form-center-selection.component";

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  standalone: true,
  imports: [
    BookingBetaAlertComponent,
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
    ScoutCenterPipe,
    PrivacyCheckboxContainerComponent
  ]
})
export class BookingFormComponent implements OnInit {

  private bookingService = inject(BookingService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  protected steps: MenuItem[] = [
    {label: 'Datos de la Entidad'},
    {label: 'Datos de Contacto'},
    {label: 'Datos de la Reserva'},
    {label: 'Otros Datos'},
    {label: 'Confirmación de Datos'}
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

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.currentUser = LoggedUserInformationService.getUserInformation().username;
    }
    if (this.authService.hasRequiredPermission(["ROLE_SCOUT_CENTER_REQUESTER"])) {
      this.bookingService.getLatestByCurrentUser().subscribe({
        next: res => this.initializeForm(res),
        error: err => {
          this.alertService.sendBasicErrorMessage(err.error.message);
          this.initializeForm();
        }
      });
    } else {
      this.initializeForm();
    }
  }

  private initializeForm(booking?: Booking) {
    this.bookingForm.createForm({
      groupName: [booking?.organizationName, Validators.required],
      cif: [booking?.cif, Validators.required],
      workDescription: [booking?.observations, [Validators.required, Validators.maxLength(510)]],
      contactName: [booking?.contactName, Validators.required],
      relationship: [booking?.contactRelationship, Validators.required],
      email: [this.currentUser, [Validators.required, Validators.email]],
      phone: [booking?.contactPhone, Validators.required],
      // centerSelection: this.centerSelectionComponent?.form,
      observations: [null, Validators.maxLength(1023)],
      exclusiveReservation: [false],
      privacy: [false, Validators.requiredTrue],
    });
    this.bookingForm.setPages([
      ["cif", "groupName", "workDescription"],
      ["contactName", "relationship", "email", "phone"],
      ["centerSelection"],
      ["privacy", "observations"]
    ]);
    this.bookingForm.onLastPage = () => {
      this.booking = this.bookingForm.value;
      this.booking.startDate = this.centerSelectionComponent.startDate;
      this.booking.endDate = this.centerSelectionComponent.endDate;
      this.booking.packs = this.centerSelectionComponent.packs;
      this.booking.scoutCenter = this.centerSelectionComponent.scoutCenter;
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
      error: err => {
        this.centerSelectionComponent.loadCenterData();
        if (err.status === 400) {
          this.alertService.sendBasicErrorMessage(err.error.message);
        } else {
          this.alertService.sendBasicErrorMessage("Vuelva a intentarlo o envíe un correo a informatica@105bentaya.org");
        }
        this.loading = false;
      }
    });
  }

  protected addCenterControl(form: FormGroup) {
    this.bookingForm.form.addControl("centerSelection", form);
  }
}
