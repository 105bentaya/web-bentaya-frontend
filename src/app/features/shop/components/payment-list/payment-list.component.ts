import {Component, inject, OnInit} from '@angular/core';
import {PaymentService} from "../../../../shared/services/payment.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import {Payment} from "../../../../shared/model/payment.model";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {DatePipe} from "@angular/common";
import {CurrencyEuroPipe} from "../../../../shared/pipes/currency-euro.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
  imports: [
    TableModule,
    Button,
    DatePipe,
    CurrencyEuroPipe,
    RouterLink
  ]
})
export class PaymentListComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly excelService = inject(ExcelService);

  protected paymentList!: Payment[];

  ngOnInit(): void {
    this.paymentService.getAll().subscribe(data => this.paymentList = data);
  }

  protected downloadTransactions() {
    this.excelService.exportAsExcel(this.paymentList.map(payment => ({...payment, amount: payment.amount / 100})),
      ["ID", "Número de Pedido", "Estado", "Tipo de Pago", "Fecha de Modificación", "Cantidad"],
      "transacciones");

  }
}
