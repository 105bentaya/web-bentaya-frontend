import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../model/payment-info.model";

@Injectable({
  providedIn: 'root'
})
export class TpvService {
  public redirectToPaymentGateway(data: PaymentInfo): void {
    const form = document.createElement('form');
    form.action = environment.tpvUrl;
    form.method = 'POST';
    form.style.display = 'none';

    const signatureVersion = this.createHiddenInput('Ds_SignatureVersion', data.Ds_SignatureVersion);
    const parameters = this.createHiddenInput('Ds_MerchantParameters', data.Ds_MerchantParameters);
    const signature = this.createHiddenInput('Ds_Signature', data.Ds_Signature);

    form.appendChild(signatureVersion);
    form.appendChild(parameters);
    form.appendChild(signature);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  private createHiddenInput(name: string, value: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    return input;
  }
}
