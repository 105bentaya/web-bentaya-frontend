import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {PreScouter} from "../../models/pre-scouter.model";
import {ScouterFormsService} from '../../services/scouter-forms.service';
import {CheckboxModule} from 'primeng/checkbox';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {FloatLabelModule} from "primeng/floatlabel";
import {FormHelper} from "../../../../shared/util/form-helper";
import {
  PrivacyCheckboxContainerComponent
} from "../../../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";
import FormUtils from "../../../../shared/util/form-utils";
import {genders} from "../../../../shared/constant";

@Component({
  selector: 'app-ser-scouter',
  templateUrl: './ser-scouter.component.html',
  styleUrls: ['./ser-scouter.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    FormTextAreaComponent,
    PrivacyCheckboxContainerComponent,
    CheckboxModule,
    SaveButtonsComponent
  ]
})
export class SerScouterComponent implements OnInit {

  private confirmationService = inject(ConfirmationService);
  private serScouterService = inject(ScouterFormsService);
  private alertService = inject(AlertService);

  protected readonly genders = genders;
  protected preScouterForm: FormHelper = new FormHelper();
  protected loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.preScouterForm.createForm({
      name: [null, [Validators.required]],
      surname: [null, Validators.required],
      birthday: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      comment: [null, [Validators.required, Validators.maxLength(512)]],
      privacy: [false, Validators.requiredTrue]
    });
  }

  protected submit() {
    this.preScouterForm.validateAll();
    if (this.preScouterForm.valid) this.showConfirmationMessage();
  }

  private showConfirmationMessage() {
    const preScouter: PreScouter = {...this.preScouterForm.value};
    const confirmationMessage = SerScouterComponent.createConfirmationMessage(preScouter);
    this.confirmationService.confirm({
      header: '¿Quiere enviar estos datos?',
      message: confirmationMessage,
      accept: () => {
        this.loading = true;
        this.alertService.sendMessage({
          title: "Enviando...",
          message: "Esto puede tardar unos segundos",
          severity: "info"
        });
        this.sendForm(preScouter);
      }
    });
  }

  private sendForm(preScouter: PreScouter) {
    this.serScouterService.sendScouterFormMail(preScouter).subscribe({
      next: () => {
        this.alertService.sendMessage({
          title: "Formulario enviado con éxito.",
          severity: "success"
        });
        this.initializeForm();
        this.loading = false;
      },
      error: () => {
        this.alertService.sendMessage({
          title: "Error al enviar la preinscripción",
          message: "Vuelva a intentarlo o envíe un correo a informatica@105bentaya.org",
          severity: "error"
        });
        this.loading = false;
      }
    });
  }

  private static createConfirmationMessage(preScouter: PreScouter): string {
    return FormUtils.listToHtmlList([
      `Nombre: ${preScouter.name}`,
      `Apellidos: ${preScouter.surname}`,
      `Fecha de nacimiento: ${preScouter.birthday}`,
      `Sexo: ${preScouter.gender}`,
      `Teléfono de contacto: ${preScouter.phone}`,
      `Correo de contacto: ${preScouter.email}`,
      `Comentario sobre la motivación para la incorporación al grupo: ${preScouter.comment}`
    ]);
  }
}
