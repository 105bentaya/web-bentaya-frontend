import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {ScoutRecord} from "../../../scouts/models/scout.model";
import {noop} from "rxjs";
import {assign} from "lodash";
import {SpecialMemberDonation} from "../../models/special-member.model";
import {
  SpecialMemberDonationFormComponent
} from "../special-member-donation-form/special-member-donation-form.component";
import {SpecialMemberDonationPipe} from "../../special-member-donation.pipe";

@Component({
  selector: 'app-special-member-donation-info',
  imports: [
    Button,
    DatePipe,
    CurrencyPipe,
    SpecialMemberDonationPipe
  ],
  templateUrl: './special-member-donation-info.component.html',
  styleUrl: './special-member-donation-info.component.scss'
})
export class SpecialMemberDonationInfoComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly ref = inject(DynamicDialogRef);

  protected donation!: SpecialMemberDonation;
  private memberId!: number;

  protected loading = false;

  ngOnInit() {
    this.donation = this.config.data.donation;
    this.memberId = this.config.data.memberId;
  }

  protected openFormDialog() {
    const ref = this.dialogService.openDialog(
      SpecialMemberDonationFormComponent,
      "Editar Donación",
      "small",
      {memberId: this.memberId, donation: this.donation}
    );
    ref.onClose.subscribe(result => result ? this.updateRecord(result) : noop());
  }

  private updateRecord(result: ScoutRecord | -1) {
    if (result === -1) {
      this.ref.close(true);
    } else {
      assign(this.donation, result);
    }
  }
}
