import {Component, inject, OnInit} from '@angular/core';
import {PurchaseInformation, PurchaseInformationForm} from "../../models/purchase-information.model";
import {Router, RouterLink} from "@angular/router";
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {PurchaseProductPipe} from "../../purchase-product.pipe";
import {InputText} from "primeng/inputtext";
import {FloatLabel} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {ShopPaymentService} from "../../services/shop-payment.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ConfirmationService} from "primeng/api";
import {TpvService} from "../../../../shared/services/tpv.service";
import {FormHelper} from "../../../../shared/util/form-helper";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-start-purchase-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    PurchaseProductPipe,
    InputText,
    FloatLabel,
    FormTextAreaComponent,
    BasicLoadingInfoComponent,
    SaveButtonsComponent,
    CurrencyEuroPipe
  ],
  templateUrl: './start-purchase-form.component.html',
  styleUrl: './start-purchase-form.component.scss'
})
export class StartPurchaseFormComponent implements OnInit {
  private readonly shopPaymentService = inject(ShopPaymentService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly tpvService = inject(TpvService);
  protected readonly formHelper = new FormHelper();

  protected purchase!: PurchaseInformation;

  ngOnInit(): void {
    this.shopPaymentService.getStartedPurchase().subscribe(value => {
      this.purchase = value;
      this.initForm();
    });
  }

  private initForm() {
    this.formHelper.createForm({
      name: [this.purchase.name, [Validators.required, Validators.maxLength(255)]],
      surname: [this.purchase.surname, [Validators.required, Validators.maxLength(255)]],
      email: [this.purchase.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: [this.purchase.phone, [Validators.required, Validators.maxLength(255)]],
      observations: [this.purchase.observations, Validators.maxLength(65535)]
    });
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.confirmationService.confirm({
        header: "Confirmar Datos",
        message: "¿Desea realizar la compra? Se procederá a redirigirle a la plataforma de pago.\n" +
          "Si decide no continuar, por favor cancele la compra para liberar los productos.",
        accept: () => this.startPayment()
      });
    }
  }

  private startPayment() {
    const purchaseInfo: PurchaseInformationForm = {...this.formHelper.value};
    this.shopPaymentService.confirmPurchase(purchaseInfo).subscribe(() => this.redirectToTpv());
  }

  private redirectToTpv() {
    this.shopPaymentService.continueOngoingPurchase().subscribe(data => this.tpvService.redirectToPaymentGateway(data));
  }

  protected cancel() {
    this.shopPaymentService.cancelPurchase().subscribe(() => {
      this.alertService.sendBasicSuccessMessage("Compra cancelada");
      this.router.navigate(["tienda-scout/carrito"], {replaceUrl: true});
    });
  }
}
