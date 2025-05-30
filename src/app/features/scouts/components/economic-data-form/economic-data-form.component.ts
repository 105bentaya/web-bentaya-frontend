import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ScoutService} from "../../services/scout.service";
import {Scout, ScoutContact} from "../../models/member.model";
import {finalize} from "rxjs";
import {FloatLabel} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Select} from "primeng/select";
import {InputText} from "primeng/inputtext";

@Component({
  selector: 'app-economic-data-form',
  imports: [
    FloatLabel,
    FormsModule,
    ReactiveFormsModule,
    SaveButtonsComponent,
    Select,
    InputText
  ],
  templateUrl: './economic-data-form.component.html',
  styleUrl: './economic-data-form.component.scss'
})
export class EconomicDataFormComponent implements OnInit {
  protected formHelper = new FormHelper();
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly scoutService = inject(ScoutService);

  public initialData = input.required<Scout>();
  protected onEditionStop = output<void | Scout>();

  protected loading: boolean = false;
  protected donors: { label: string; value: "SCOUT" | number }[] = [];

  ngOnInit() {
    const scoutInfo = this.initialData().scoutInfo;
    this.donors = scoutInfo.contactList.map(contact => ({
      value: contact.id,
      label: this.contactToLabel(contact)
    }));
    this.donors.push({value: "SCOUT", label: "Persona Asociada"});

    this.formHelper.createForm({
      donorId: [scoutInfo.contactList.find(contact => contact.donor)?.id ?? "SCOUT", Validators.required],
      iban: [scoutInfo.economicData.iban, [Validators.required, this.ibanValidator]],
      bank: [scoutInfo.economicData.bank, [Validators.required, Validators.maxLength(255)]],
    });
  }

  private contactToLabel(contact: ScoutContact): string {
    let result: string;
    if (contact.personType === "REAL") {
      result = contact.name;
      if (contact.surname) {
        result += ` ${contact.surname}`;
      }
    } else {
      result = contact.companyName!;
    }
    if (contact.relationship) {
      result += ` (${contact.relationship})`;
    }
    return result;
  }


  private readonly ibanValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/\s+/g, '').toUpperCase();
    if (!value) {
      return null;
    }

    if (value.length < 15 || value.length > 34) {
      return {ibanInvalid: true};
    }

    const rearranged = value.slice(4) + value.slice(0, 4);

    let remainder = rearranged
      .split('')
      .map((char: string) => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? (code - 55).toString() : char;
      })
      .join('');

    while (remainder.length > 2) {
      const part = remainder.slice(0, 9);
      remainder = (parseInt(part, 10) % 97).toString() + remainder.slice(part.length);
    }

    return parseInt(remainder, 10) % 97 === 1 ? null : {ibanInvalid: true};
  };

  protected submit() {
    if (this.formHelper.validateAll()) {
      const form = {...this.formHelper.value};
      if (form.donorId === 'SCOUT') {
        delete form.donorId;
      }

      this.scoutService.updateScoutEconomicData(this.initialData().id, form)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => this.onEditionStop.emit(result));
    }
  }
}
