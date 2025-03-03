import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {SeniorSectionService} from "../../senior-section.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {CheckboxModule} from 'primeng/checkbox';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {InputTextModule} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FloatLabel} from "primeng/floatlabel";

@Component({
  selector: 'app-senior-form',
  templateUrl: './senior-form.component.html',
  styleUrls: ['./senior-form.component.scss'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    FormTextAreaComponent,
    CheckboxModule,
    CheckboxContainerComponent,
    SaveButtonsComponent,
    FloatLabel
  ]
})
export class SeniorFormComponent implements OnInit {

  private readonly confirmationService = inject(ConfirmationService);
  private readonly seniorService = inject(SeniorSectionService);
  private readonly alertService = inject(AlertService);

  protected seniorForm = new FormHelper();
  protected loading = false;

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.seniorForm.createForm({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      acceptMessageGroup: [false],
      acceptNewsletter: [false],
      privacy: [false, Validators.requiredTrue],
      observations: ["", Validators.maxLength(510)]
    });
  }

  protected submit() {
    this.seniorForm.validateAll();
    if (this.seniorForm.valid) this.confirmationService.confirm({
      message: '¿Desea enviar estos datos? Al inscribirse en nuestra sección sénior, confirma que ha leído y ' +
        'comprendido los derechos y deberes previamente expuestos.',
      accept: () => this.sendForm()
    });
  }

  private sendForm() {
    this.loading = true;
    this.alertService.sendMessage({
      title: "Enviando...",
      message: "Esto puede tardar unos segundos",
      severity: "info"
    });
    this.seniorService.sendForm(this.seniorForm.value).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Formulario enviado con éxito");
        this.createForm();
        this.loading = false;
      }, error: () => this.loading = false
    });
  }
}
