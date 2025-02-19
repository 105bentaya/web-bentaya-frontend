import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {EmailService} from '../../../../shared/services/email.service';
import {Complaint} from '../../models/complaint.model';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {FormHelper} from "../../../../shared/util/form-helper";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import {
  PrivacyCheckboxContainerComponent
} from "../../../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FloatLabelModule} from "primeng/floatlabel";
import FormUtils from "../../../../shared/util/form-utils";
import {Select} from "primeng/select";

@Component({
  selector: 'app-canal-denuncias',
  templateUrl: './canal-denuncias.component.html',
  styleUrls: ['./canal-denuncias.component.scss'],
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    FormTextAreaComponent,
    PrivacyCheckboxContainerComponent,
    CheckboxModule,
    SaveButtonsComponent,
    Select
  ]
})
export class CanalDenunciasComponent implements OnInit {

  private confirmationService = inject(ConfirmationService);
  private alertService = inject(AlertService);
  private serScoutService = inject(EmailService);
  protected loading = false;
  protected complaintForm = new FormHelper();
  protected categories =
    [
      "Personas Educandas",
      "Personas Voluntarias",
      "Familias",
      "Grupo Scout",
      "Organización Federada",
      "Trabajadoras",
      "Otra Categoría"
    ];
  protected types =
    [
      "Acoso",
      "Abusos",
      "Agresiones y amenazas",
      "Discriminación",
      "Incumplimiento del Código Ético",
      "Incumplimiento de normativa interna",
      "Incumplimiento de la ley",
      "Otra"
    ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.complaintForm.createForm({
      category: [null, Validators.required],
      type: [null, Validators.required],
      name: [''],
      surname: [''],
      phone: [''],
      email: ['', Validators.email],
      text: ['', [Validators.required, Validators.maxLength(65535)]],
      privacy: [false, Validators.requiredTrue]
    });
  }

  protected submit() {
    this.complaintForm.validateAll();
    if (this.complaintForm.valid) {
      this.confirmForm();
    }
  }

  private createName() {
    const nameValue = this.complaintForm.controlValue('name');
    const surnameValue = this.complaintForm.controlValue('surname');
    if (nameValue && surnameValue) {
      return `${nameValue}, ${surnameValue}`;
    }
    if (surnameValue) {
      return surnameValue;
    }
    return nameValue;
  }

  private createMessage(complaint: Complaint): string {
    const msgInfo = [`Categoría: ${complaint.category}`, `Tipo: ${complaint.type}`, `Texto de los hechos: ${complaint.text}`];
    if (complaint.name) {
      msgInfo.push(`Nombre: ${complaint.name}`);
    }
    if (complaint.phone) {
      msgInfo.push(`Teléfono de contacto: ${complaint.phone}`);
    }
    if (complaint.email) {
      msgInfo.push(`Correo electrónico: ${complaint.email}`);
    }
    return FormUtils.listToHtmlList(msgInfo);
  }

  private confirmForm() {
    const complaint: Complaint = {...this.complaintForm.value, name: this.createName()};
    this.confirmationService.confirm({
      header: '¿Quiere enviar estos datos?',
      message: this.createMessage(complaint),
      accept: () => {
        this.loading = true;
        this.alertService.sendMessage({
          title: "Enviando...",
          message: "Esto puede tardar unos segundos",
          severity: "info"
        });
        this.saveForm(complaint);
      }
    });
  }

  private createAlertMsg(email: any) {
    return email != '' ?
      "Nos pondremos en contacto con usted. Un recibí de su queja ha sido enviado a " + email :
      "Su queja ha sido enviada con éxito";
  }

  private saveForm(complaint: Complaint) {
    this.serScoutService.sendComplaintMail(complaint).subscribe({
      next: () => {
        this.alertService.sendMessage({
          title: "Formulario enviado con éxito",
          message: this.createAlertMsg(complaint.email),
          severity: "success"
        });
        this.loading = false;
        this.initializeForm();
      },
      error: () => this.loading = false
    });
  }
}
