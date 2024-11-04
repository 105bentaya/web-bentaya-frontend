import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {Partnership} from './model/partnership.model';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {AlertService} from "../../shared/services/alert-service.service";
import {EmailService} from "../../shared/services/email.service";
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../shared/components/save-buttons/save-buttons.component";
import {FormTextAreaComponent} from "../../shared/components/form-text-area/form-text-area.component";
import {FormHelper} from "../../shared/util/form-helper";
import {
  PrivacyCheckboxContainerComponent
} from "../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";

@Component({
  selector: 'app-colaboraciones',
  templateUrl: './colaboraciones.component.html',
  styleUrls: ['./colaboraciones.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    FormTextAreaComponent,
    CheckboxModule,
    SaveButtonsComponent,
    PrivacyCheckboxContainerComponent
  ]
})
export class ColaboracionesComponent implements OnInit {

  private alertService = inject(AlertService);
  private emailService = inject(EmailService);

  protected formHelper = new FormHelper();
  protected loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.formHelper.createForm({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      entityName: [''],
      message: ['', [Validators.required, Validators.maxLength(600)]],
      privacy: [false, Validators.requiredTrue]
    });
  }

  protected submit() {
    this.formHelper.validateAll();
    if (this.formHelper.valid) {
      this.loading = true;
      this.alertService.sendMessage({
        title: "Enviando...",
        message: "Esto puede tardar unos segundos",
        severity: "info"
      });
      const partnership: Partnership = {...this.formHelper.value};
      this.saveForm(partnership);
    }
  }

  private saveForm(partnership: Partnership) {
    this.emailService.sendPartnershipMail(partnership).subscribe({
      next: () => {
        this.alertService.sendMessage({
          title: "Mensaje enviado con éxito.",
          message: "Gracias por contactar con nosotros y dejar su idea de colaboración.",
          severity: "success"
        });
        this.loading = false;
        this.initializeForm();
      },
      error: () => this.loading = false
    });
  }
}
