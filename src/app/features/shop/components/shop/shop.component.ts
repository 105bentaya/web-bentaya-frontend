import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {BadgeDirective} from "primeng/badge";
import {SelectButton} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {NgClass} from "@angular/common";
import {Tag} from "primeng/tag";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {ProductService} from "../../services/product.service";
import {CartService} from '../../services/cart.service';
import {Product} from "../../models/product.model";
import {ProductComponent} from "../product/product.component";
import {noop} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-shop',
  imports: [
    RouterLink,
    BadgeDirective,
    SelectButton,
    FormsModule,
    TableModule,
    Tag,
    NgClass,
    CurrencyEuroPipe
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  providers: [DynamicDialogService, DialogService]
})
export class ShopComponent implements OnInit {
  private readonly dialogService = inject(DynamicDialogService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly viewOptions = [
    {icon: 'pi pi-list', value: true},
    {icon: 'pi pi-table', value: false}
  ];
  protected showTable: boolean = !!localStorage.getItem('shopView');

  protected products!: Product[];
  protected cartButton!: { label: string, routerLink: string, severity: "danger" | "info" };

  ngOnInit(): void {
    this.getCartItems();
    this.productService.getAll().subscribe(products => this.products = products
      .map(product => ({...product, totalStock: product.stockList.reduce((a, b) => a + b.stock, 0)}))
      .sort(a => a.totalStock == 0 ? 1 : -1)
    );
  }

  private getCartItems() {
    this.cartService.getCartStatus().subscribe(status => {
      if (!isNaN(+status)) {
        this.cartButton = {severity: "info", label: status, routerLink: "carrito"};
      } else {
        this.cartButton = {
          severity: "danger",
          label: "!",
          routerLink: status == "STARTED" ? "compra" : "continuar-compra"
        };
      }
    });
  }

  protected productClick(selectedProduct: Product) {
    this.dialogService.openDialog(ProductComponent, selectedProduct.name, "small", {
      product: selectedProduct, imageUrl: this.getProductImage(selectedProduct)
    }).onClose.subscribe(saved => saved ? this.getCartItems() : noop());
  }

  protected saveView() {
    this.showTable ? localStorage.setItem('shopView', "1") : localStorage.removeItem('shopView');
  }

  protected getProductImage(product: Product): string {
    return this.productService.getPhotoUrl(product.image);
  }
}
