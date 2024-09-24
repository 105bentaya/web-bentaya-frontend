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
  PrivacyCheckboxContainerComponent
} from "../../../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";

@Component({
  selector: 'app-senior-form',
  templateUrl: './senior-form.component.html',
  styleUrls: ['./senior-form.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    FormTextAreaComponent,
    CheckboxModule,
    PrivacyCheckboxContainerComponent,
    SaveButtonsComponent
  ]
})
export class SeniorFormComponent implements OnInit {

  private confirmationService = inject(ConfirmationService);
  private seniorService = inject(SeniorSectionService);
  private alertService = inject(AlertService);

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
      accept: () => this.sendForm()
    });
  }

  private sendForm() {
    this.loading = true;
    this.seniorService.sendForm(this.seniorForm.value).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Formulario recibido");
        this.createForm();
        this.loading = false;
      }, error: () => {
        this.alertService.sendBasicErrorMessage("Vuelva a intentarlo o envíe un correo a informatica@105bentaya.org");
        this.loading = false;
      }
    });
  }
}
