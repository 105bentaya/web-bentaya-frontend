import {Component, inject, OnInit} from '@angular/core';
import {DonationsService} from "../../services/donations.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import {Donation} from "../../model/donation.model";
import {DonationTypePipe} from "../../donation-type.pipe";
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
  providers: [DonationTypePipe],
  imports: [
    TableModule,
    CurrencyPipe,
    DonationTypePipe,
    DatePipe,
    Button
  ]
})
export class DonationListComponent implements OnInit {

  private donationService = inject(DonationsService);
  private excelService = inject(ExcelService);
  private donationTypePipe = inject(DonationTypePipe);

  protected donations!: Donation[];
  protected excelLoading = false;

  ngOnInit() {
    this.donationService.getAll().subscribe(res => this.donations = res);
  }

  protected exportExcel() {
    this.excelLoading = true;
    this.excelService.exportAsExcel(
      this.donations
        .map((donation: any) => {
          const mapped = {...donation, frequency: this.donationTypePipe.transform(donation)};
          delete mapped["singleDonationPaymentType"];
          return mapped;
        }),
      ["ID", "Nombre", "Primer Apellido", "Segundo Apellido", "DNI o CIF", "Teléfono", "Correo",
        "Quiere deducir", "Cantidad", "Frecuencia", "Iban", "Estado del pago", "Fecha"],
      "donaciones"
    );
    this.excelLoading = false;
  }
}
