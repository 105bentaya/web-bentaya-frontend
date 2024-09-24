import {Component, inject, Input, OnInit} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {PreScout} from '../../models/pre-scout.model';
import {ScoutFormsService} from '../../services/scout-forms.service';
import {KeyFilterModule} from 'primeng/keyfilter';
import {CheckboxModule} from 'primeng/checkbox';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {FormHelper} from "../../../../shared/util/form-helper";
import {FloatLabelModule} from "primeng/floatlabel";
import {
  PrivacyCheckboxContainerComponent
} from "../../../../shared/components/privacy-checkbox-container/privacy-checkbox-container.component";
import {genders} from "../../../../shared/constant";
import {LargeFormButtonsComponent} from "../../../../shared/components/large-form-buttons/large-form-buttons.component";
import {MessagesModule} from "primeng/messages";

@Component({
  selector: 'app-ser-scout',
  templateUrl: './ser-scout.component.html',
  styleUrls: ['./ser-scout.component.scss'],
  standalone: true,
  imports: [
    StepsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    FormTextAreaComponent,
    CheckboxModule,
    KeyFilterModule,
    PrivacyCheckboxContainerComponent,
    LargeFormButtonsComponent,
    MessagesModule
  ]
})
export class SerScoutComponent implements OnInit {

  private serScoutService = inject(ScoutFormsService);
  private alertService = inject(AlertService);

  protected steps: MenuItem[] = [
    {label: 'Datos Generales'},
    {label: 'Datos de Contacto'},
    {label: 'Grupos de Prioridad'},
    {label: 'Otros Datos'},
    {label: 'Confirmación'}
  ];
  protected finalEmail = "";
  protected preScout!: PreScout;
  protected preScoutForm = new FormHelper();
  protected minDate: Date = new Date(2000, 0, 1);
  protected maxDate: Date = new Date(2100, 11, 31);
  @Input()
  secondYearOfTerm!: number;
  protected formTerm!: string;
  protected readonly genders = genders;
  protected priorities = [
    "Tiene hermanos/as o es hija de scouters que están en el grupo en la Ronda Solar de la inscripción.",
    "Es hija de scouters o scouts que hayan pertenecido al grupo o a Scouts de Canarias / ASDE.",
    "Tiene hermanos o hermanas en la lista de espera para la misma ronda.",
    "Ninguna de las anteriores"
  ];
  protected dropdownPriorities = [
    {name: "Grupo 1", value: 1},
    {name: "Grupo 2", value: 2},
    {name: "Grupo 3", value: 3},
    {name: "Ninguna de las anteriores", value: 4},
  ];
  protected successOnSubmit = false;
  protected loading = false;
  protected noWhiteSpaceFilter = /\S/;
  protected surname = "";
  protected parentsSurname = "";
  protected sizes: string[] = ["5/6", "7/8", "9/10", "11/12", "XS", "S", "M", "L", "XL", "2XL"];

  ngOnInit(): void {
    this.formTerm = `${this.secondYearOfTerm - 1}/${this.secondYearOfTerm - 2000}`;
    this.priorities[0] = `Tiene hermanos/as o es hija de scouters que están en el grupo en la Ronda Solar
      ${this.formTerm}.`;
    this.minDate = new Date(this.secondYearOfTerm - 21, 0, 1);
    this.maxDate = new Date(this.secondYearOfTerm - 7, 11, 31);
    this.initializeForm();
  }

  private initializeForm() {
    this.preScoutForm.createForm({
      name: ['', Validators.required],
      firstSurname: ['', Validators.required],
      secondSurname: [''],
      birthday: [null, Validators.required],
      dni: ['', Validators.required],
      gender: [null, Validators.required],
      size: ['', Validators.required],
      medicalData: ['', [Validators.required, Validators.maxLength(512)]], //512??
      parentsName: ['', Validators.required],
      parentsFirstSurname: ['', Validators.required],
      parentsSecondSurname: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      comment: ['', [Validators.required, Validators.maxLength(256)]], //samehere
      priority: [null, Validators.required],
      priorityInfo: ['', this.priorityValidation()],
      hasBeenInGroup: [false],
      yearAndSection: ['', [this.hasBeenBeforeValidation()]],
      privacy: [false, Validators.requiredTrue]
    });
    this.preScoutForm.setPages([
      ["name", "firstSurname", "birthday", "gender", "medicalData", "yearAndSection", "dni", "size"],
      ["parentsName", "parentsFirstSurname", "relationship", "phone", "email"],
      ["priority", "priorityInfo"],
      ["comment", "privacy"]
    ]);
    this.preScoutForm.onLastPage = () => this.createPreScoutForm();
  }

  private createPreScoutForm() {
    this.surname = `${this.preScoutForm.controlValue('firstSurname')} ${this.preScoutForm.controlValue('secondSurname')}`.trim();
    this.parentsSurname = `${this.preScoutForm.controlValue('parentsFirstSurname')} ${this.preScoutForm.controlValue('parentsSecondSurname')}`.trim();
    this.preScout = {
      ...this.preScoutForm.value,
      surname: this.surname.replace(/\s/g, '-'),
      parentsSurname: this.parentsSurname.replace(/\s/g, '-')
    };
  }

  protected sendForm() {
    this.alertService.sendMessage({
      title: "Enviando...",
      message: "Esto puede tardar unos segundos",
      severity: "info"
    });
    this.loading = true;
    this.serScoutService.sendScoutFormMail(this.preScout).subscribe({
      next: () => {
        this.alertService.sendMessage({
          title: "Formulario enviado con éxito.",
          severity: "success"
        });
        this.finalEmail = this.preScout.email;
        this.loading = false;
        this.initializeForm();
        this.successOnSubmit = true;
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

  private hasBeenBeforeValidation = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
    return this.preScoutForm?.form?.controls["hasBeenInGroup"]?.value === true && !control.value ? {required: true} : null;
  };

  private priorityValidation = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
    const priority = this.preScoutForm?.form?.controls["priority"]?.value;
    return this.priorityNeedsInfo(priority) && !control.value ? {required: true} : null;
  };

  protected priorityNeedsInfo(priorityValue: number): boolean {
    return priorityValue > 0 && priorityValue <= 3;
  }
}
