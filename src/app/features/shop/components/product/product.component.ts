import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {CartService} from '../../services/cart.service';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {Product, ProductSize} from "../../models/product.model";
import {RadioButton} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {ButtonGroup} from "primeng/buttongroup";
import {
  RadioButtonContainerComponent
} from "../../../../shared/components/radio-button-container/radio-button-container.component";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";
import {CartProductForm} from "../../models/cart.model";

@Component({
  selector: 'app-product',
  imports: [
    RadioButton,
    FormsModule,
    Button,
    ButtonGroup,
    RadioButtonContainerComponent,
    CurrencyEuroPipe
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly cartService = inject(CartService);
  private readonly alertService = inject(AlertService);

  protected product!: Product;
  protected imageUrl!: string;
  protected count = 0;
  protected selectedSize: ProductSize | undefined;

  ngOnInit(): void {
    if (this.config.data) {
      this.product = this.config.data.product;
      this.imageUrl = this.config.data.imageUrl;
      if (this.product.stockList.length == 1 && this.product.stockList[0].stock > 0) {
        this.selectedSize = this.product.stockList[0];
        this.count = 1;
      }
    } else {
      this.ref.close();
    }
  }

  protected addProductToCart() {
    const product: CartProductForm = {
      productSizeId: this.selectedSize!.id,
      count: this.count
    };
    this.cartService.updateProduct(product).subscribe(() => {
      this.alertService.sendBasicSuccessMessage("El producto se ha añadido correctamente");
      this.ref.close(true);
    });
  }

  protected minusItem() {
    if (this.count > 1) {
      this.count--;
    }
  }

  protected plusItem() {
    if (this.count < this.selectedSize!.stock) {
      this.count++;
    }
  }

  protected selectedSizeChange() {
    if (this.selectedSize!.stock < this.count) {
      this.count = this.selectedSize!.stock;
    } else if (this.count == 0 && this.selectedSize!.stock > 0) {
      this.count = 1;
    }
  }
}
