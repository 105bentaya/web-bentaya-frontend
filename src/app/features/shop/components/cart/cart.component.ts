import {Component, inject, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Router, RouterLink} from "@angular/router";
import {CartItem} from "../../models/cart.model";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ShopPaymentService} from "../../services/shop-payment.service";
import {ConfirmationService} from "primeng/api";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ProductComponent} from "../product/product.component";
import {finalize, noop} from "rxjs";
import {TableModule} from "primeng/table";
import {NgClass} from "@angular/common";
import {Button} from "primeng/button";
import {ButtonGroup} from "primeng/buttongroup";
import {DialogService} from "primeng/dynamicdialog";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-cart',
  imports: [
    BasicLoadingInfoComponent,
    RouterLink,
    TableModule,
    NgClass,
    Button,
    ButtonGroup,
    CurrencyEuroPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [DynamicDialogService, DialogService]
})
export class CartComponent implements OnInit {
  private readonly dialogService = inject(DynamicDialogService);
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly alertService = inject(AlertService);
  private readonly shopPaymentService = inject(ShopPaymentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  protected loading = false;
  protected cartItemList!: CartItem[];
  protected tooManyProducts = false;
  protected startedPurchase = false;

  ngOnInit(): void {
    this.getCart();
  }

  private getCart(): void {
    this.loading = true;
    this.cartService.getUserCart()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: cart => {
          this.cartItemList = cart;
          this.tooManyProducts = this.cartItemList.some(cartItem => cartItem.items.some(item => item.count > item.stock));
        },
        error: err => err.status === 409 ? this.router.navigate(["/tienda-scout/compra"], {replaceUrl: true}) : noop()
      });
  }

  protected productClick(selectedProduct: Product) {
    this.dialogService.openDialog(ProductComponent, selectedProduct.name, "small", {
      product: selectedProduct, imageUrl: this.getProductImage(selectedProduct)
    }).onClose.subscribe(saved => saved ? this.getCart() : noop());
  }

  protected updateItem(productSizeId: number, count: number) {
    this.loading = true;
    this.cartService.updateProduct({productSizeId, count}).subscribe({
      next: () => this.getCart(),
      error: () => this.loading = false
    });
  }

  protected emptyCart() {
    this.loading = true;
    this.cartService.emptyCart().subscribe(() => {
      this.alertService.sendBasicSuccessMessage("Carrito vaciado");
      this.getCart();
    });
  }

  protected confirmPurchase() {
    if (this.cartIsValid()) {
      this.confirmationService.confirm({
        header: "Comenzar Compra",
        message: "¿Desea iniciar la compra? Se procederá a reservar los productos seleccionados. " +
          "Si en algún momento decide no continuar con la operación, cancele la compra para liberar los productos.",
        accept: () => this.startPurchase()
      });
    }
  }

  private startPurchase() {
    this.startedPurchase = true;
    this.shopPaymentService.startPurchase().subscribe(() => {
      this.router.navigate(["/tienda-scout/compra"], {replaceUrl: true}).then();
    });
  }

  protected cartIsValid(): boolean {
    return !this.tooManyProducts && !this.loading && !this.startedPurchase;
  }

  protected getProductImage(product: Product): string {
    return this.productService.getPhotoUrl(product.image);
  }

  protected get totalPrice(): number {
    return this.cartItemList.reduce((acc, item) => acc + item.totalPrice, 0);
  }
}
