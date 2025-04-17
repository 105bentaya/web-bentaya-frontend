import {Component, inject, OnInit} from '@angular/core';
import {Checkbox} from "primeng/checkbox";
import {CheckboxContainerComponent} from "../../../shared/components/checkbox-container/checkbox-container.component";
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {FormTextAreaComponent} from "../../../shared/components/form-text-area/form-text-area.component";
import {InputText} from "primeng/inputtext";
import {
  LargeFormButtonsComponent
} from "../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Select} from "primeng/select";
import {Steps} from "primeng/steps";
import {maintenanceEmail, yesNoOptions} from "../../../shared/constant";
import {MenuItem} from "primeng/api";
import {FormHelper} from "../../../shared/util/form-helper";
import {JamboreeForm} from "../jamboree-form.model";
import {DateUtils} from "../../../shared/util/date-utils";
import {SelectButton} from "primeng/selectbutton";
import {Button} from "primeng/button";
import {BooleanPipe} from "../../../shared/pipes/boolean.pipe";
import {DatePipe} from "@angular/common";
import {KeyFilter} from "primeng/keyfilter";
import {JamboreeService} from "../jamboree.service";
import {AlertService} from "../../../shared/services/alert-service.service";
import {Message} from "primeng/message";

@Component({
  selector: 'app-jamboree-form',
  imports: [
    Checkbox,
    CheckboxContainerComponent,
    DatePicker,
    FloatLabel,
    FormTextAreaComponent,
    InputText,
    LargeFormButtonsComponent,
    ReactiveFormsModule,
    Select,
    Steps,
    SelectButton,
    Button,
    BooleanPipe,
    DatePipe,
    KeyFilter,
    Message
  ],
  templateUrl: './jamboree-form.component.html',
  styleUrl: './jamboree-form.component.scss'
})
export class JamboreeFormComponent implements OnInit {

  private readonly jamboreeService = inject(JamboreeService);
  private readonly alertService = inject(AlertService);

  protected readonly maintenanceEmail = maintenanceEmail;
  protected readonly genders = ["Femenino", "Masculino", "Femenino Trans", "Masculino Trans", "No Binario", "No señala"];
  protected readonly levels = ["A1", "A2", "B1", "B2", "C1", "C2 o Nativo"];
  protected readonly participantTypes = ["Participante (14 a 17 años a 30-7-27)", "IST (>= 18 años)", "TL (scouters)"];
  protected readonly sizes: string[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  protected readonly yesNoOptions = yesNoOptions;

  protected readonly steps: MenuItem[] = [
    {label: 'Datos Básicos'},
    {label: 'Datos Médicos'},
    {label: 'Datos de Contacto'},
    {label: 'Otros Datos'},
    {label: 'Confirmación'}
  ];

  protected jamboreeForm!: JamboreeForm;
  protected formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);
  protected loading = false;
  protected successOnSubmit = false;

  ngOnInit() {
    this.formHelper.createForm({
      participantType: [null, [Validators.required, Validators.maxLength(255)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      surname: [null, [Validators.required, Validators.maxLength(255)]],
      feltName: [null, [Validators.maxLength(255)]],
      gender: [null, [Validators.required, Validators.maxLength(255)]],
      dni: [null, [Validators.required, Validators.maxLength(255)]],
      passportNumber: [null, [Validators.required, Validators.maxLength(255)]],
      nationality: [null, [Validators.required, Validators.maxLength(255)]],
      birthDate: [null, [Validators.required, Validators.maxLength(255)]],
      phoneNumber: [null, [Validators.required, Validators.maxLength(255)]],
      email: [null, [Validators.required, Validators.maxLength(255), Validators.email]],
      resident: [null, [Validators.required]],
      municipality: [null, [this.residentValidation, Validators.maxLength(255)]],

      bloodType: [null, [Validators.required, Validators.maxLength(255)]],
      medicalData: [null, [Validators.required, Validators.maxLength(2000)]],
      medication: [null, [Validators.required, Validators.maxLength(2000)]],
      allergies: [null, [Validators.required, Validators.maxLength(2000)]],
      foodIntolerances: [null, [Validators.required, Validators.maxLength(2000)]],
      vaccineProgram: [null, [Validators.required]],

      mainContact: this.formBuilder.group({
        name: [null, [Validators.required, Validators.maxLength(255)]],
        surname: [null, [Validators.required, Validators.maxLength(255)]],
        mobilePhone: [null, [Validators.required, Validators.maxLength(255)]],
        landlinePhone: [null, [Validators.required, Validators.maxLength(255)]],
        email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]],
        address: [null, [Validators.required, Validators.maxLength(511)]],
        cp: [null, [Validators.required, Validators.maxLength(255)]],
        locality: [null, [Validators.required, Validators.maxLength(255)]]
      }),
      secondaryContact: this.formBuilder.group({
        name: [null, [Validators.required, Validators.maxLength(255)]],
        surname: [null, [Validators.required, Validators.maxLength(255)]],
        mobilePhone: [null, [Validators.required, Validators.maxLength(255)]],
        email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]],
      }),

      languages: this.formBuilder.array([], [Validators.required]),
      size: [null, [Validators.required, Validators.maxLength(255)]],
      dietPreference: [null, [Validators.maxLength(2000)]],
      observations: [null, [Validators.maxLength(2000)]],
      privacy: [false, Validators.requiredTrue]
    });
    this.formHelper.setPages([
      ["participantType", "name", "surname", "feltName", "dni", "passportNumber", "nationality", "birthDate", "gender", "phoneNumber", "email", "resident", "municipality"],
      ["bloodType", "medicalData", "medication", "allergies", "vaccineProgram", "foodIntolerances"],
      ["mainContact", "secondaryContact"],
      ["size", "dietPreference", "languages", "privacy", "observations"]
    ]);
    this.addLanguage();
    this.formHelper.onLastPage = () => this.createPreScoutForm();
    this.formHelper.currentPage = 0;
  }

  private readonly residentValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!control.value && this.formHelper.controlValue("resident") === true) ? {required: true} : null;
  };

  protected deleteLanguage(index: number) {
    const array = this.formHelper.getFormArray("languages");
    array.removeAt(index);
    if (array.length < 1) this.addLanguage();
  }

  protected addLanguage() {
    this.formHelper.getFormArray("languages").push(this.formBuilder.group({
      language: [null, [Validators.required, Validators.maxLength(255)]],
      level: [null, [Validators.required, Validators.maxLength(255)]],
    }));
  }

  private createPreScoutForm() {
    this.jamboreeForm = {
      ...this.formHelper.value
    };
    this.jamboreeForm.birthDate = DateUtils.toLocalDate(this.jamboreeForm.birthDate);
    if (!this.jamboreeForm.resident) {
      this.jamboreeForm.municipality = undefined;
    }
  }

  protected sendForm() {
    this.loading = true;
    this.jamboreeService.saveForm(this.jamboreeForm).subscribe(() => {
      this.alertService.sendBasicSuccessMessage("Formulario guardado con éxito");
      this.successOnSubmit = true;
    });
  }

  protected resetForm() {
    location.reload();
  }
}
