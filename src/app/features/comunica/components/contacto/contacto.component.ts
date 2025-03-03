import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ContactMessage} from '../../models/contactMessage.model';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {EmailService} from "../../../../shared/services/email.service";
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {generalEmail, maintenanceEmail} from "../../../../shared/constant";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    FormTextAreaComponent,
    CheckboxContainerComponent,
    CheckboxModule,
    SaveButtonsComponent
  ]
})
export class ContactoComponent implements OnInit {

  private readonly alertService = inject(AlertService);
  private readonly emailService = inject(EmailService);
  protected readonly maintenanceEmail = maintenanceEmail;
  protected readonly generalEmail = generalEmail;
  protected loading = false;
  protected contactForm = new FormHelper();


  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.contactForm.createForm({
      name: ['', Validators.required],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(65535)]],
      privacy: [false, Validators.requiredTrue]
    });
  }

  protected submit() {
    this.contactForm.validateAll();
    if (!this.contactForm.invalid) {
      const contactMessage: ContactMessage = {...this.contactForm.value};
      this.saveForm(contactMessage);
    }
  }

  private saveForm(contactMessage: ContactMessage) {
    this.loading = true;
    this.emailService.sendContactMessageMail(contactMessage).subscribe({
      next: () => {
        this.alertService.sendMessage({
          title: "Mensaje enviado con éxito.",
          message: "Gracias por contactar con nosotros y dejar su mensaje.",
          severity: "success"
        });
        this.loading = false;
        this.initializeForm();
      },
      error: () => this.loading = false
    });
  }
}
