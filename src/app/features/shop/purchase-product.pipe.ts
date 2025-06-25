import {Pipe, PipeTransform} from '@angular/core';
import {BoughtProduct} from "./models/purchase-information.model";
import {CurrencyEuroPipe} from "../../shared/pipes/currency-euro.pipe";

@Pipe({
  name: 'purchaseProduct'
})
export class PurchaseProductPipe implements PipeTransform {

  transform(product: BoughtProduct): string {
    const pipe = new CurrencyEuroPipe();
    const total = product.count > 1 ? ` - ${pipe.transform(product.price * product.count)}` : "";
    return `${product.productName}, ${product.sizeName} (${pipe.transform(product.price)}) - ${product.count} unidad${product.count != 1 ? 'es' : ''}${total}`;
  }
}
