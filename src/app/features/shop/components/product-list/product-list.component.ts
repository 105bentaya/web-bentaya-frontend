import {Component, inject, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Tag} from "primeng/tag";
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {ProductFormComponent} from "../product-form/product-form.component";
import {noop} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";

@Component({
  selector: 'app-product-list',
  imports: [
    TableModule,
    Button,
    Tag,
    CurrencyEuroPipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [DynamicDialogService, DialogService]
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly dialogService = inject(DynamicDialogService);

  protected productList!: Product[];

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getAll().subscribe(data => this.productList = data);
  }

  protected openAddDialog() {
    this.dialogService.openDialog(ProductFormComponent, "Añadir Producto", "small")
      .onClose.subscribe(saved => saved ? this.getProducts() : noop());
  }

  protected openEditDialog(productId: number) {
    this.dialogService.openDialog(ProductFormComponent, "Editar Producto", "small", productId)
      .onClose.subscribe(() => this.getProducts());
  }

  protected getProductStock(product: Product): number {
    return product.stockList.reduce((a, b) => a + b.stock, 0);
  }

  protected productPhoto(product: Product) {
    return this.productService.getPhotoUrl(product.image);
  }
}
