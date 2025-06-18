import {Component, inject, input} from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {SpecialMemberDonationPipe} from "../../../special-member/special-member-donation.pipe";
import {TableModule} from "primeng/table";
import {SpecialMemberDonation} from "../../../special-member/models/special-member.model";
import {
  SpecialMemberDonationInfoComponent
} from "../../../special-member/components/special-member-donation-info/special-member-donation-info.component";
import {DialogService} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-donation-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    PrimeTemplate,
    SpecialMemberDonationPipe,
    TableModule,
    Button,
    RouterLink
  ],
  templateUrl: './donation-list.component.html',
  styleUrl: './donation-list.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class DonationListComponent {
  private readonly dialogService = inject(DynamicDialogService);
  donations = input.required<SpecialMemberDonation[]>();
  showSummary = input(false);

  protected openDonationInfo(donation: SpecialMemberDonation, index: number) {
    const ref = this.dialogService.openDialog(
      SpecialMemberDonationInfoComponent,
      "Donación",
      "small",
      {donation}
    );
    ref.onClose.subscribe(deleted => {
      if (deleted) {
        this.donations().splice(index, 1);
      }
    });
  }

  protected get totalDonatedAmount(): number {
    return this.donations()
      .filter(don => don.type === "ECONOMIC")
      .reduce((acc, donation) => acc + (donation.amount ?? 0), 0);
  };

  protected get totalInKindAmount(): number {
    return this.donations()
      .filter(don => don.type === "IN_KIND")
      .reduce((acc, donation) => acc + (donation.amount ?? 0), 0);
  };

  protected get totalEconomicDonations(): number {
    return this.donations().filter(donation => donation.type === 'ECONOMIC').length;
  }

  protected get totalInKindDonations(): number {
    return this.donations().filter(donation => donation.type === 'IN_KIND').length;
  }
}
