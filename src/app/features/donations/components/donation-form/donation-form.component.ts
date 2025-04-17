import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {DonationsService} from "../../services/donations.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ConfirmationService, MenuItem} from "primeng/api";
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {DonationForm} from "../../model/donation-form.model";
import {environment} from "../../../../../environments/environment";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DonationFrequencyPipe} from '../../donation-frecuency.pipe';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {CurrencyPipe} from '@angular/common';
import {FormHelper} from "../../../../shared/util/form-helper";
import {FloatLabelModule} from "primeng/floatlabel";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {
  LargeFormButtonsComponent
} from "../../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {maintenanceEmail, moneyEmail} from "../../../../shared/constant";
import {
  GeneralAButtonComponent
} from "../../../../shared/components/buttons/general-a-button/general-a-button.component";
import {
  RadioButtonContainerComponent
} from "../../../../shared/components/radio-button-container/radio-button-container.component";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";

@Component({
  selector: 'app-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss'],
  imports: [
    RouterLink,
    StepsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    RadioButtonModule,
    InputNumberModule,
    DonationFrequencyPipe,
    CheckboxContainerComponent,
    CheckboxModule,
    CurrencyPipe,
    LargeFormButtonsComponent,
    GeneralAButtonComponent,
    RadioButtonContainerComponent,
    BooleanPipe
  ]
})
export class DonationFormComponent implements OnInit {

  private readonly donationsService = inject(DonationsService);
  private readonly alertService = inject(AlertService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly route = inject(ActivatedRoute);

  protected readonly maintenanceEmail = maintenanceEmail;
  protected readonly moneyEmail = moneyEmail;

  protected loading = false;
  protected donationSuccess = false;
  protected formHelper = new FormHelper();
  protected donationForm!: DonationForm;
  protected steps: MenuItem[] = [
    {label: 'Datos de Donante'},
    {label: 'Importe de Donación'},
    {label: 'Datos de Donación'},
    {label: 'Confirmación'}
  ];

  @ViewChild("tpvForm")
  protected tpvForm: any;
  @ViewChild("i1")
  protected signatureVersion: any;
  @ViewChild("i2")
  protected parameters: any;
  @ViewChild("i3")
  protected signature: any;
  protected url = environment.tpvUrl;

  ngOnInit(): void {
    const successParam = this.route.snapshot.queryParams["success"];
    if (successParam) {
      if (successParam === "0") {
        this.alertService.sendBasicErrorMessage(`No se ha podido completar su donación. Si cree que esto es un error contacte a ${maintenanceEmail}`);
      } else if (successParam === "1") {
        this.donationSuccess = true;
      }
    }
    this.formHelper.createForm({
      name: ["", Validators.required],
      firstSurname: ["", Validators.required],
      secondSurname: [""],
      cif: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      deduct: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      frequency: ["", Validators.required],
      singleDonationPaymentType: [null, this.singleDonationValidator()],
      iban: ["", this.ibanValidator()],
      privacy: [false, Validators.requiredTrue]
    });
    this.formHelper.currentPage = 0;
    this.formHelper.setPages([
      ["name", "firstSurname", "secondSurname", "cif", "phone", "email", "deduct"],
      ["amount", "frequency"],
      ["singleDonationPaymentType", "iban", "privacy"]
    ]);
    this.formHelper.onLastPage = () => this.createDonationForm();
  }

  private createDonationForm() {
    this.donationForm = {
      ...this.formHelper.value,
      amount: Math.floor(this.formHelper.controlValue("amount") * 100)
    };
  }

  protected sendForm() {
    this.confirmationService.confirm({
      message: '¿Quiere realizar una donación con estos datos? Revíselos bien para evitar errores, ' +
        'ya que esto puede causar algún problema durante el proceso de cobro o que no se le registre adecuadamente en ' +
        'nuestra lista de donantes.',
      accept: () => {
        this.loading = true;
        this.alertService.sendMessage({
          title: "Enviando...",
          message: "Esto puede tardar unos segundos",
          severity: "info"
        });
        this.donationsService.sendForm(this.donationForm).subscribe({
          next: (id) => {
            if (this.donationForm.frequency == "SINGLE" && this.donationForm.singleDonationPaymentType == "TPV") {
              this.sendTpvInformation(id);
            } else {
              this.alertService.sendBasicSuccessMessage("Donación enviada correctamente. Una copia de los datos le habrá llegado a su correo");
              this.loading = false;
              this.donationSuccess = true;
            }
          },
          error: () => this.loading = false
        });
      }
    });
  }

  private sendTpvInformation(donationId: number) {
    const url = window.location.href.split('?')[0];
    const urls = {
      okUrl: `${url}?success=1`,
      koUrl: `${url}?success=0`
    };
    this.donationsService.getNewDonationInfo(donationId, urls).subscribe({
      next: data => {
        this.signatureVersion.nativeElement.value = data.Ds_SignatureVersion;
        this.parameters.nativeElement.value = data.Ds_MerchantParameters;
        this.signature.nativeElement.value = data.Ds_Signature;
        this.tpvForm.nativeElement.submit();
      },
      error: () => this.loading = false
    });
  }

  private singleDonationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.formHelper?.form?.controls["frequency"]?.value === 'SINGLE' && !control.value ? {required: true} : null;
    };
  }

  private ibanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.ibanIsRequired() && !control.value ? {required: true} : null;
    };
  }

  protected ibanIsRequired() {
    return this.formHelper?.form?.controls["frequency"]?.value === 'SINGLE' &&
      this.formHelper?.form?.controls["singleDonationPaymentType"]?.value === 'IBAN' ||
      this.formHelper?.form?.controls["frequency"]?.value !== 'SINGLE';
  }
}
