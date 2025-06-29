import {Component, inject, input, OnInit, output} from '@angular/core';
import {RegistrationDate, Scout, ScoutInfo, ScoutType} from "../../../models/scout.model";
import {FloatLabel} from "primeng/floatlabel";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {yesNoOptions} from "../../../../../shared/constant";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {SelectButton} from "primeng/selectbutton";
import {NgClass} from "@angular/common";
import {Button} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {DateUtils} from "../../../../../shared/util/date-utils";
import {ScoutInfoForm} from "../../../models/scout-form.model";
import {finalize} from "rxjs";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {ScoutService} from "../../../services/scout.service";
import {isNil} from "lodash";
import {AlertService} from "../../../../../shared/services/alert-service.service";
import {ScoutTypeFormComponent} from "../../scout-type-form/scout-type-form.component";
import {LoggedUserDataService} from "../../../../../core/auth/services/logged-user-data.service";
import {UserRole} from "../../../../users/models/role.model";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-group-data-form',
  imports: [
    FloatLabel,
    FormsModule,
    ReactiveFormsModule,
    SaveButtonsComponent,
    SelectButton,
    NgClass,
    Button,
    DatePicker,
    ScoutTypeFormComponent
  ],
  templateUrl: './group-data-form.component.html',
  styleUrl: './group-data-form.component.scss'
})
export class GroupDataFormComponent implements OnInit {
  protected formHelper = new FormHelper();
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);
  private readonly userData = inject(LoggedUserDataService);
  private readonly confirmationService = inject(ConfirmationService);

  private readonly today = DateUtils.dateTruncatedToDay(new Date());
  protected readonly yesNoOptions = yesNoOptions;

  initialData = input.required<Scout>();
  newScoutType = input<ScoutType>();
  protected onEditionStop = output<void | Scout>();

  protected loading: boolean = false;
  private registrationDateUpdated = false;

  ngOnInit() {
    const scoutInfo = this.initialData().scoutInfo;
    const possibleNewScoutType = this.newScoutType();
    this.formHelper.createForm({
      scoutType: [possibleNewScoutType ?? scoutInfo.scoutType, Validators.required],
      groupId: [this.getScoutGroup(scoutInfo), this.groupValidation],
      registrationDates: this.formBuilder.array(
        scoutInfo.registrationDates.map(date => this.createRegistrationDate(date))
      ),
      federated: [scoutInfo.federated],
      census: [scoutInfo.census]
    });

    if (!this.userData.hasRequiredPermission(UserRole.SECRETARY)) {
      this.formHelper.get("census")?.disable();
    }
  }

  private readonly groupValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const scoutType: ScoutType = this.formHelper.get("scoutType")?.value;
    return isNil(control.value) && (scoutType === "SCOUT" || scoutType === "SCOUTER") ? {groupRequired: true} : null;
  };

  private getScoutGroup(scoutInfo: ScoutInfo) {
    if (scoutInfo.scoutType === "SCOUTER" && !scoutInfo.group) {
      return 0;
    }
    return scoutInfo.group?.id;
  }

  protected updateFormValues(newStatus: ScoutType) {
    const wasActive = this.initialData().scoutInfo.scoutType !== "INACTIVE";
    const isActive = newStatus !== "INACTIVE";

    if (!isActive) {
      this.formHelper.get("federated")?.setValue(false);
      if (wasActive && !this.registrationDateUpdated) {
        this.addUnregistrationDate();
      } else if (!wasActive && this.registrationDateUpdated) {
        this.deleteRegistrationDate();
      }
    } else {
      this.formHelper.get("federated")?.setValue(true);
      if (wasActive && this.registrationDateUpdated) {
        this.deleteUnregistrationDate();
      } else if (!wasActive && !this.registrationDateUpdated) {
        this.addRegistrationDate();
      }
    }
  }

  private addUnregistrationDate() {
    const registrationDates = this.formHelper.getFormArray("registrationDates");
    const lastScoutRegistrationDate = registrationDates.get((registrationDates.length - 1).toString());

    if (registrationDates.length === 0) {
      const date: RegistrationDate = {
        unregistrationDate: DateUtils.dateTruncatedToDay(new Date()),
        registrationDate: new Date(0)
      };
      registrationDates.push(this.createRegistrationDate(date));
    } else {
      const unregistrationControl = lastScoutRegistrationDate?.get("unregistrationDate");
      if (unregistrationControl?.value) {
        const registrationDate = DateUtils.dateTruncatedToDay(new Date(unregistrationControl?.value));
        registrationDate.setDate(registrationDate.getDate() + 1);

        const date: RegistrationDate = {
          unregistrationDate: DateUtils.dateTruncatedToDay(new Date()),
          registrationDate: registrationDate
        };
        registrationDates.push(this.createRegistrationDate(date));
      } else {
        lastScoutRegistrationDate?.get("unregistrationDate")?.setValue(new Date());
      }
      this.registrationDateUpdated = true;
    }
  }

  private deleteUnregistrationDate() {
    const registrationDates = this.formHelper.getFormArray("registrationDates");
    const lastScoutRegistrationDate = registrationDates.get((registrationDates.length - 1).toString());
    const lastUnregistrationDate = lastScoutRegistrationDate?.get("unregistrationDate");
    if (new Date(lastUnregistrationDate?.value).getTime() === this.today.getTime()) {
      lastUnregistrationDate?.setValue(null);
    }
    this.registrationDateUpdated = false;
  }

  private addRegistrationDate() {
    const registrationDates = this.formHelper.getFormArray("registrationDates");
    registrationDates.push(this.createRegistrationDate({
      registrationDate: DateUtils.dateTruncatedToDay(new Date())
    }));
    this.registrationDateUpdated = true;
  }

  private deleteRegistrationDate() {
    const registrationDates = this.formHelper.getFormArray("registrationDates");
    const lastScoutRegistrationDate = registrationDates.get((registrationDates.length - 1).toString());
    const lastRegistrationDate = lastScoutRegistrationDate?.get("registrationDate")?.value;

    if (new Date(lastRegistrationDate).getTime() === this.today.getTime()) {
      this.deleteRegistrationDateForm(registrationDates.length - 1);
    }
    this.registrationDateUpdated = false;
  }

  private createRegistrationDate(data?: RegistrationDate) {
    return this.formBuilder.group({
      id: [data?.id],
      registrationDate: [DateUtils.dateOrUndefined(data?.registrationDate), Validators.required],
      unregistrationDate: [DateUtils.dateOrUndefined(data?.unregistrationDate), this.requiredIfNotLast]
    }, {validators: [this.dateValidation, this.existingDateValidation]});
  }

  private readonly requiredIfNotLast: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formArray = this.formHelper.getFormArray("registrationDates");
    const currentControlIndex = formArray?.controls.findIndex(c => c === control.parent);

    return currentControlIndex < formArray?.length - 1 && !control.value ? {required: true} : null;
  };

  private readonly existingDateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formArray = control.parent as FormArray;
    const currentControlIndex = formArray?.controls.findIndex(c => c === control);

    if (currentControlIndex) {
      const previousControl = formArray.controls[currentControlIndex - 1];
      const minDate = new Date(previousControl.get("unregistrationDate")?.value);
      const currentDate = control.get("registrationDate")?.value;
      if (currentDate && new Date(currentDate) <= minDate) {
        return {datesOverlap: true};
      }
    }

    return null;
  };

  private readonly dateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let startDate = control.get("registrationDate")?.value;
    let endDate = control.get("unregistrationDate")?.value;
    if (startDate && endDate) {
      startDate = DateUtils.dateTruncatedToDay(startDate);
      endDate = DateUtils.dateTruncatedToDay(endDate);
      if (endDate <= startDate) {
        return {endDateBefore: true};
      }
    }
    return null;
  };

  protected deleteRegistrationDateForm(index: number) {
    this.formHelper.getFormArray("registrationDates").removeAt(index);
  }

  protected addRegistrationDateForm() {
    const array = this.formHelper.getFormArray("registrationDates");
    if (array.controls.some(group =>
      !group?.get("registrationDate")?.value ||
      !group?.get("unregistrationDate")?.value)
    ) {
      this.alertService.sendMessage({
        title: "Aviso",
        severity: "warn",
        message: "No se puede añadir una nueva fecha si no se han completado las anteriores"
      });
    } else {
      array.push(this.createRegistrationDate());
      setTimeout(() => document.getElementById(`registration-${array.length - 1}`)?.scrollIntoView(), 50);
    }
  }

  protected submit() {
    if (this.formHelper.validateAll()) {
      this.loading = true;
      const form: ScoutInfoForm = {...this.formHelper.value};
      form.registrationDates = form.registrationDates.map(date => {
        return {
          id: date.id,
          registrationDate: DateUtils.toLocalDate(date.registrationDate),
          unregistrationDate: date.unregistrationDate ? DateUtils.toLocalDate(date.unregistrationDate) : undefined
        };
      });
      if (form.scoutType === "MANAGER" || form.scoutType === "COMMITTEE" || form.scoutType == "INACTIVE") {
        form.groupId = undefined;
      }

      const wasActive = this.initialData().scoutInfo.scoutType !== "INACTIVE" && form.scoutType === "INACTIVE";
      if (wasActive || this.scoutWillLoseUsers(form.scoutType)) {
        this.confirmationService.confirm({
          header: wasActive ? "Confirmar Baja" : "Confirmar",
          message: wasActive ? "Si da de baja a la asociada, se eliminará el acceso de todos sus usuarios y se eliminarán las asistencias futuras. ¿Desea continuar?" :
            "Si cambia el tipo de asociada, se eliminará el acceso de todos sus usuarios. Para volver a añadir un usuario deberás hacerlo desde la pestaña de 'Datos Personales'. ¿Desea continuar?",
          accept: () => this.updateInfo(form),
          reject: () => this.loading = false
        });
      } else {
        this.updateInfo(form);
      }
    }
  }

  private scoutWillLoseUsers(newScoutType: ScoutType) {
    if (this.initialData().usernames.length < 1) {
      return false;
    }

    const currentScoutType = this.initialData().scoutInfo.scoutType;
    return currentScoutType === "SCOUT" && newScoutType !== "SCOUT" ||
      this.scoutTypeHasScouterAccess(currentScoutType) && !this.scoutTypeHasScouterAccess(currentScoutType);
  }

  private scoutTypeHasScouterAccess(scoutType: ScoutType) {
    return scoutType === "SCOUTER" || scoutType === "MANAGER" || scoutType === "COMMITTEE";
  }

  private updateInfo(form: ScoutInfoForm) {
    this.scoutService.updateScoutInfo(this.initialData().id, form)
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => this.onEditionStop.emit(result));
  }
}
