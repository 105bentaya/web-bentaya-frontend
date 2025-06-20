import {Component, inject, OnInit} from '@angular/core';
import {DonationsService} from "../../services/donations.service";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormHelper} from "../../../../shared/util/form-helper";
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {InputNumber} from "primeng/inputnumber";
import {FloatLabel} from "primeng/floatlabel";
import {InputText} from "primeng/inputtext";
import {FileUtils} from "../../../../shared/util/file.utils";
import {finalize} from "rxjs";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-donation-file-form',
  imports: [
    SaveButtonsComponent,
    ReactiveFormsModule,
    InputNumber,
    FloatLabel,
    InputText
  ],
  templateUrl: './donation-file-form.component.html',
  styleUrl: './donation-file-form.component.scss'
})
export class DonationFileFormComponent implements OnInit {
  protected readonly formHelper = new FormHelper();
  private readonly donationService = inject(DonationsService);
  private readonly ref = inject(DynamicDialogRef);

  protected loading = false;

  ngOnInit() {
    this.formHelper.createForm({
      fiscalYear: [null, [Validators.required, Validators.min(2000), Validators.max(9999)]],
      declarantRepresentativePhone: [null, [Validators.required, Validators.min(100000000), Validators.max(999999999)]],
      declarantRepresentativeName: [null, [Validators.required, Validators.maxLength(39)]],
      declarantRepresentativeSurname: [null, [Validators.required, Validators.maxLength(20)]],
      autonomousCommunityDeduction: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    }, {validators: [this.nameSurnameValidator]});
  }

  private readonly nameSurnameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const name = control.get("declarantRepresentativeName")?.value;
    const surname = control.get("declarantRepresentativeSurname")?.value;

    return name && surname && name.length + surname.length >= 39 ? {nameTooLong: true} : null;
  };

  protected generateFile() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const form = {...this.formHelper.value};
      form.autonomousCommunityDeduction = Math.round(form.autonomousCommunityDeduction * 100);
      this.donationService.generateDownloadFile(form)
        .pipe(finalize(() => this.loading = false))
        .subscribe(res => {
          FileUtils.downloadFile(res);
          this.ref.close();
        });
    }
  }
}
