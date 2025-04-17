import {Component, inject, Input, OnInit} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ScoutFormsService} from '../../scout-forms.service';
import {KeyFilterModule} from 'primeng/keyfilter';
import {CheckboxModule} from 'primeng/checkbox';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {FormHelper} from "../../../../shared/util/form-helper";
import {FloatLabelModule} from "primeng/floatlabel";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {genders, maintenanceEmail} from "../../../../shared/constant";
import {
  LargeFormButtonsComponent
} from "../../../../shared/components/buttons/large-form-buttons/large-form-buttons.component";
import {preScoutPriorities, PreScoutPriority} from "../../priority.constant";
import {PreScoutForm} from "../../models/pre-scout-form.model";
import {DatePicker} from "primeng/datepicker";
import {Message} from "primeng/message";
import {BooleanPipe} from "../../../../shared/pipes/boolean.pipe";

@Component({
  selector: 'app-ser-scout',
  templateUrl: './ser-scout.component.html',
  styleUrls: ['./ser-scout.component.scss'],
  imports: [
    StepsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    FormTextAreaComponent,
    CheckboxModule,
    KeyFilterModule,
    CheckboxContainerComponent,
    LargeFormButtonsComponent,
    Message,
    DatePicker,
    BooleanPipe
  ]
})
export class SerScoutComponent implements OnInit {

  private readonly serScoutService = inject(ScoutFormsService);
  private readonly alertService = inject(AlertService);

  protected readonly steps: MenuItem[] = [
    {label: 'Datos Generales'},
    {label: 'Datos de Contacto'},
    {label: 'Grupo de Prioridad'},
    {label: 'Otros Datos'},
    {label: 'Confirmación'}
  ];
  protected readonly genders = genders;
  protected readonly priorities = preScoutPriorities;
  protected readonly maintenanceEmail = maintenanceEmail;
  protected readonly sizes: string[] = ["5/6", "7/8", "9/10", "11/12", "XS", "S", "M", "L", "XL", "2XL"];
  protected preScout!: PreScoutForm;
  protected preScoutForm = new FormHelper();
  protected minDate: Date = new Date(2000, 0, 1);
  protected maxDate: Date = new Date(2100, 11, 31);
  @Input() secondYearOfTerm!: number;
  protected formTerm!: string;
  protected successOnSubmit = false;
  protected loading = false;
  protected noWhiteSpaceFilter = /\S/;

  ngOnInit(): void {
    this.formTerm = `${this.secondYearOfTerm - 1}/${this.secondYearOfTerm - 2000}`;
    this.minDate = new Date(this.secondYearOfTerm - 21, 0, 1);
    this.maxDate = new Date(this.secondYearOfTerm - 7, 11, 31);
    this.initializeForm();
  }

  private initializeForm() {
    this.preScoutForm.createForm({
      name: [null, Validators.required],
      firstSurname: [null, Validators.required],
      secondSurname: [null],
      birthday: [null, Validators.required],
      gender: [null, Validators.required],
      dni: [null, Validators.required],
      size: [null, Validators.required],
      medicalData: [null, [Validators.required, Validators.maxLength(512)]],
      hasBeenInGroup: [false],
      yearAndSection: [null, this.hasBeenBeforeValidation()],
      parentsName: [null, Validators.required],
      parentsFirstSurname: [null, Validators.required],
      parentsSecondSurname: [null],
      relationship: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      priority: [null, Validators.required],
      priorityInfo: [null, this.priorityValidation()],
      comment: [null, [Validators.required, Validators.maxLength(256)]],
      privacy: [false, Validators.requiredTrue]
    });
    this.preScoutForm.setPages([
      ["name", "firstSurname", "secondSurname", "birthday", "gender", "dni", "size", "medicalData", "hasBeenInGroup", "yearAndSection"],
      ["parentsName", "parentsFirstSurname", "parentsSecondSurname", "relationship", "phone", "email"],
      ["priority", "priorityInfo"],
      ["comment", "privacy"]
    ]);
    this.preScoutForm.onLastPage = () => this.createPreScoutForm();
  }

  private createPreScoutForm() {
    this.preScout = {
      ...this.preScoutForm.value,
      priority: this.priority.value
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
          title: "Formulario enviado con éxito",
          severity: "success"
        });
        this.loading = false;
        this.initializeForm();
        this.successOnSubmit = true;
      },
      error: () => this.loading = false
    });
  }

  private readonly hasBeenBeforeValidation = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
    return this.preScoutForm.controlValue("hasBeenInGroup") === true && !control.value ? {required: true} : null;
  };

  private readonly priorityValidation = (): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
    return this.priority?.requiresExtraInfo && !control.value ? {required: true} : null;
  };

  protected get priority(): PreScoutPriority {
    return this.preScoutForm.controlValue("priority");
  }
}
