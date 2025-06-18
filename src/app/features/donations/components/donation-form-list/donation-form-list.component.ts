import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DonationTypePipe} from "../../donation-type.pipe";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {DonationsService} from "../../services/donations.service";
import {ExcelService} from "../../../../shared/services/excel.service";
import {Donation} from "../../model/donation.model";

@Component({
  selector: 'app-donation-form-list',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    DonationTypePipe,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './donation-form-list.component.html',
  styleUrl: './donation-form-list.component.scss'
})
export class DonationFormListComponent implements OnInit {
  private readonly donationService = inject(DonationsService);
  private readonly excelService = inject(ExcelService);
  private readonly donationTypePipe = inject(DonationTypePipe);

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
      `formularios_de_donación_a_${new Date().toISOString().slice(0, 19)}`
    );
    this.excelLoading = false;
  }
}
