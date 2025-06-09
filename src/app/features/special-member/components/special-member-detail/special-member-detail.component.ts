import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {SpecialMemberService} from "../../special-member.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {TabsModule} from "primeng/tabs";
import {
  SpecialMember,
  SpecialMemberDetail,
  SpecialMemberDetailRecord,
  SpecialMemberDonation,
  SpecialMemberRole
} from "../../models/special-member.model";
import {CurrencyPipe, DatePipe, Location, LowerCasePipe, NgIf} from "@angular/common";
import {BasicInfoComponent} from "../../../scouts/components/basic-info/basic-info.component";
import {CensusPipe} from "../../../scouts/pipes/census.pipe";
import {IdDocumentPipe} from "../../../scouts/pipes/id-document.pipe";
import {IdDocumentTypePipe} from "../../../scouts/pipes/id-document-type.pipe";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {SpecialMemberFormComponent} from "../special-member-form/special-member-form.component";
import {SpecialMemberForm} from "../../models/special-member-form.model";
import {finalize, noop} from "rxjs";
import {SpecialRolePipe} from "../../special-role.pipe";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {DialogService} from "primeng/dynamicdialog";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {
  SpecialMemberDonationFormComponent
} from "../special-member-donation-form/special-member-donation-form.component";
import {
  SpecialMemberDonationInfoComponent
} from "../special-member-donation-info/special-member-donation-info.component";
import {SpecialMemberDonationPipe} from "../../special-member-donation.pipe";

@Component({
  selector: 'app-special-member-detail',
  imports: [
    BasicLoadingInfoComponent,
    TabsModule,
    NgIf,
    BasicInfoComponent,
    DatePipe,
    CensusPipe,
    IdDocumentPipe,
    IdDocumentTypePipe,
    Tag,
    RouterLink,
    Button,
    SpecialMemberFormComponent,
    SpecialRolePipe,
    PrimeTemplate,
    TableModule,
    SpecialMemberDonationPipe,
    LowerCasePipe,
    CurrencyPipe
  ],
  templateUrl: './special-member-detail.component.html',
  styleUrl: './special-member-detail.component.scss',
  providers: [DialogService, DynamicDialogService]
})
export class SpecialMemberDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly alertService = inject(AlertService);
  protected readonly location = inject(Location);

  protected specialMemberDetail: SpecialMemberDetail | undefined;
  protected editing: boolean = false;
  protected selectedRole!: SpecialMemberRole;

  protected loading: boolean = false;

  ngOnInit() {
    const id: number = +this.route.snapshot.params['id'];
    this.specialMemberService.getById(id).subscribe(specialMemberDetail => {
      this.selectedRole = specialMemberDetail.records.find(record => record.id === id)!.role;
      this.specialMemberDetail = specialMemberDetail;
    });
  }

  protected showTab(type: SpecialMemberRole): boolean {
    return this.specialMemberDetail!.records.some(record => record.role === type);
  }

  protected get personIsReal() {
    return this.specialMemberDetail!.person.type === 'REAL';
  }

  protected get selectedMemberForm(): SpecialMember {
    const detail: SpecialMemberDetailRecord = this.specialMemberDetail?.records.find(record => record.role === this.selectedRole)!;
    return {...detail, person: this.specialMemberDetail!.person};
  }

  protected totalDonatedAmount(record: SpecialMemberDetailRecord): number {
    return record.donations.reduce((acc, donation) => acc + (donation.amount ?? 0), 0);
  };

  protected totalInKindDonations(record: SpecialMemberDetailRecord): number {
    return record.donations.filter(donation => donation.type === 'IN_KIND').length;
  }

  protected update(form: SpecialMemberForm) {
    this.specialMemberService.updateSpecialMember(form, this.selectedMemberForm.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.specialMemberDetail = res;
        this.alertService.sendBasicSuccessMessage("Registro actualizado");
        this.editing = false;
      });
  }

  protected openDonationForm(record: SpecialMemberDetailRecord) {
    const ref = this.dialogService.openDialog(
      SpecialMemberDonationFormComponent,
      "Añadir Donación",
      "small",
      {memberId: record.id}
    );
    ref.onClose.subscribe(result => {
      if (result) {
        const list = record.donations;
        list.push(result);
        this.openDonationInfo(result, record, list.length - 1);
      }
    });
  }

  protected openDonationInfo(donation: SpecialMemberDonation, record: SpecialMemberDetailRecord, index: number) {
    const ref = this.dialogService.openDialog(
      SpecialMemberDonationInfoComponent,
      "Donación",
      "small",
      {donation, memberId: record.id}
    );
    ref.onClose.subscribe(deleted => deleted ? record.donations.splice(index, 1) : noop());
  }
}
