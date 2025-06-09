import {Component, inject, input, OnInit, output} from '@angular/core';
import {FormHelper} from "../../../../../shared/util/form-helper";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ScoutService} from "../../../services/scout.service";
import {Scout, ScoutContact} from "../../../models/scout.model";
import {finalize} from "rxjs";
import {FloatLabel} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {Select} from "primeng/select";
import {InputText} from "primeng/inputtext";
import ScoutHelper from "../../../scout.util";

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
    const scout = this.initialData();
    this.donors = scout.contactList.map(contact => ({
      value: contact.id,
      label: this.contactToLabel(contact)
    }));
    this.donors.push({value: "SCOUT", label: "Persona Asociada"});

    this.formHelper.createForm({
      donorId: [scout.contactList.find(contact => contact.donor)?.id ?? "SCOUT", Validators.required],
      iban: [scout.economicData.iban, [Validators.required, ScoutHelper.ibanValidator]],
      bank: [scout.economicData.bank, [Validators.required, Validators.maxLength(255)]],
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
