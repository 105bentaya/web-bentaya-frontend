import {Component, inject, input, OnInit, output} from '@angular/core';
import {Scout} from "../../../models/scout.model";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormTextAreaComponent} from "../../../../../shared/components/form-text-area/form-text-area.component";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {AccordionPanel} from "primeng/accordion";
import {ScoutHistoryForm} from "../../../models/scout-form.model";
import {ScoutService} from "../../../services/scout.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-scout-history-form',
  imports: [
    SaveButtonsComponent,
    FormTextAreaComponent,
    FloatLabel,
    ReactiveFormsModule
  ],
  providers: [AccordionPanel],
  templateUrl: './scout-history-form.component.html',
  styleUrl: './scout-history-form.component.scss'
})
export class ScoutHistoryFormComponent implements OnInit {

  protected formHelper = new FormHelper();
  private readonly scoutService = inject(ScoutService);

  initialData = input.required<Scout>();
  protected onEditionStop = output<void | Scout>();
  protected loading: boolean = false;

  ngOnInit() {
    this.formHelper.createForm({
      progressions: [this.initialData().scoutHistory?.progressions, Validators.maxLength(65535)],
      observations: [this.initialData().scoutHistory?.observations, Validators.maxLength(65535)]
    });
  }

  protected onSubmit() {
    if (this.formHelper.validateAll()) {
      const formValue: ScoutHistoryForm = {...this.formHelper.value};

      this.loading = true;
      this.scoutService.updateScoutHistory(this.initialData().id, formValue)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => this.onEditionStop.emit(result));
    }
  }
}
