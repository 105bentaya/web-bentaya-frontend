import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {PurchaseInformation} from "../../models/purchase-information.model";
import {PurchaseProductPipe} from "../../purchase-product.pipe";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {ShopPaymentService} from "../../services/shop-payment.service";
import {TpvService} from "../../../../shared/services/tpv.service";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-continue-purchase-form',
  imports: [
    RouterLink,
    PurchaseProductPipe,
    BasicLoadingInfoComponent,
    SaveButtonsComponent,
    CurrencyEuroPipe
  ],
  templateUrl: './continue-purchase-form.component.html',
  styleUrl: './continue-purchase-form.component.scss'
})

export class ContinuePurchaseFormComponent implements OnInit {
  private readonly shopPaymentService = inject(ShopPaymentService);
  private readonly tpvService = inject(TpvService);
  private readonly router = inject(Router);

  protected purchase!: PurchaseInformation;

  ngOnInit(): void {
    this.shopPaymentService.getOngoingPurchase().subscribe({
      next: value => this.purchase = value
    });
  }

  protected continue() {
    this.shopPaymentService.continueOngoingPurchase().subscribe({
      next: formData => this.tpvService.redirectToPaymentGateway(formData)
    });
  }

  protected cancel() {
    this.shopPaymentService.cancelPurchase().subscribe({
      next: () => this.router.navigate(["/tienda-scout/carrito"])
    });
  }
}
