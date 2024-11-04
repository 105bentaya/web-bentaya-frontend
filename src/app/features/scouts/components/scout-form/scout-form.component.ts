import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Scout} from "../../models/scout.model";
import {ScoutService} from "../../services/scout.service";
import {unitGroups} from "../../../../shared/model/group.model";
import {ConfirmationService} from "primeng/api";
import {ScoutUserFormListComponent} from "../scout-user-form-list/scout-user-form-list.component";
import {ScoutUsernamesUpdate} from "../../models/scout-usernames-update.model";
import {PreScout} from "../../../scout-forms/models/pre-scout.model";
import {Observable} from "rxjs";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";
import {TitleCasePipe} from "@angular/common";
import {ContactFormListComponent} from '../contact-form-list/contact-form-list.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {FormHelper} from "../../../../shared/util/form-helper";
import {genders} from "../../../../shared/constant";
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";
import {FormTextAreaComponent} from "../../../../shared/components/form-text-area/form-text-area.component";
import FormUtils from "../../../../shared/util/form-utils";
import {Contact} from "../../models/contact.model";

@Component({
  selector: 'app-scout-form',
  templateUrl: './scout-form.component.html',
  styleUrls: ['./scout-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TabViewModule,
    FloatLabelModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    FormTextAreaComponent,
    SelectButtonModule,
    ContactFormListComponent,
    ScoutUserFormListComponent,
    SaveButtonsComponent
  ]
})
export class ScoutFormComponent implements OnInit {

  private ref = inject(DynamicDialogRef);
  private alertService = inject(AlertService);
  private config = inject(DynamicDialogConfig);
  private formBuilder = inject(FormBuilder);
  private scoutService = inject(ScoutService);
  private confirmationService = inject(ConfirmationService);

  protected readonly groups = unitGroups;
  protected readonly genders = genders;
  protected readonly options = [{label: 'Sí', value: true}, {label: 'No', value: false}];
  protected scoutFormHelper = new FormHelper();
  protected scoutContactList!: FormArray;
  protected scout: Scout | undefined;
  protected loading = false;
  protected disableLoading = false;
  protected isNew = false;
  @ViewChild("userList") private userTable!: ScoutUserFormListComponent;
  protected usernamesValid = true;
  private preScoutId!: number;

  ngOnInit(): void {
    if (this.config.data?.scout) {
      this.scout = this.config.data.scout;
      this.initForm(this.scout);
    } else {
      this.isNew = true;
      const preScout = this.config.data?.scoutFromPreScout;
      if (preScout) {
        this.preScoutId = preScout.id;
        this.initNewPreScoutForm(preScout);
      } else {
        this.initForm();
      }
    }
  }

  private initForm(scout?: Scout) {
    this.scoutFormHelper.createForm({
      name: [scout?.name, Validators.required],
      surname: [scout?.surname, Validators.required],
      dni: [scout?.dni],
      birthday: [scout ? new Date(scout.birthday) : null, Validators.required],
      groupId: [scout?.groupId, Validators.required],
      gender: [scout?.gender, Validators.required],
      medicalData: [scout?.medicalData, Validators.maxLength(1024)],
      shirtSize: [scout?.shirtSize],
      municipality: [scout?.municipality],
      imageAuthorization: [scout?.imageAuthorization, Validators.required],
      census: [scout?.census],
      observations: [scout?.observations],
      progressions: [scout?.progressions],
      contactList: this.formBuilder.array([], Validators.required)
    });
    this.scoutContactList = this.scoutFormHelper.form.get('contactList') as FormArray;
    scout?.contactList.forEach(contact => this.addContact(contact));
  }

  private initNewPreScoutForm(preScout: PreScout) {
    const pipe = new TitleCasePipe();
    const scout: Scout = {
      name: pipe.transform(preScout.name),
      surname: pipe.transform(preScout.surname),
      dni: preScout.dni == "NO TIENE" ? undefined : preScout.dni,
      birthday: new Date(preScout.birthday.split("/").reverse().join("-")),
      groupId: preScout.groupId!,
      gender: pipe.transform(preScout.gender),
      medicalData: preScout.medicalData!,
      shirtSize: preScout.size,
      imageAuthorization: null!,
      contactList: [{
        name: pipe.transform(preScout.parentsName! + preScout.parentsSurname!),
        relationship: pipe.transform(preScout.relationship!),
        phone: preScout.phone,
        email: preScout.email
      }]
    };
    this.initForm(scout);
  }

  protected addContact(contact?: Contact) {
    this.scoutContactList.push(this.formBuilder.group({
      name: [contact?.name, Validators.required],
      relationship: [contact?.relationship],
      email: [contact?.email],
      phone: [contact?.phone]
    }, {validators: this.contactValidator}));
  }

  protected deleteContact(index: number) {
    this.scoutContactList.removeAt(index);
  }

  protected onTabChange(event: TabViewChangeEvent) {
    if (event.index == 2 && !this.userTable.users) {
      this.userTable.loadUsers();
    }
  }

  private formIsValid() {
    this.scoutFormHelper.validateAll();
    const contactListFormGroups = this.scoutContactList.controls as FormGroup[];
    contactListFormGroups.forEach(con => FormHelper.validateControls(con));
    this.usernamesValid = this.userTable.usersAreValid();
    return !this.scoutFormHelper.isDirtyAndInvalid() && this.usernamesValid;
  }

  protected onSubmit() {
    if (this.formIsValid()) {
      this.loading = true;
      const scout: Scout = {...this.scoutFormHelper.value};
      const users = this.userTable.getUsernames();
      if (this.isNew) {
        if (!users || users.length == 0) {
          this.confirmationService.confirm({
            message: "¿Quiere crear a esta persona educanda sin asignarle ningún usuario?",
            accept: () => this.addScout(scout),
            reject: () => this.loading = false
          });
        } else {
          this.scoutService.getScoutUsernamesUpdateInfo(users).subscribe(
            result => this.confirmationService.confirm({
              message: this.generateUsernameCreationMessage(result),
              accept: () => this.addScout(scout, users),
              reject: () => this.loading = false
            })
          );
        }
      } else {
        scout.id = this.scout?.id;
        if (this.userTable.usersHaveChanged()) {
          this.scoutService.getScoutUsernamesUpdateInfo(users, this.scout?.id).subscribe(
            result => this.confirmationService.confirm({
              message: this.generateUsernameChangeMessage(result, users.length == 0),
              accept: () => setTimeout(() => this.checkGroupAndUpdateScout(scout, users), 700)
            })
          );
        } else this.checkGroupAndUpdateScout(scout);
      }
    }
  }

  private checkGroupAndUpdateScout(scout: Scout, users?: string[]) {
    if (this.scout?.groupId != scout.groupId) {
      this.confirmationService.confirm({
        message: 'Esta acción eliminará a la persona educanda de su la lista de unidad y se eliminarán todas sus' +
          ' asistencias y pagos guardados.',
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.updateScout(scout, users)
      });
    } else {
      this.updateScout(scout, users);
    }
  }

  private addScout(scout: Scout, users?: string[]) {
    this.loading = true;
    this.saveScout(scout).subscribe({
      next: (savedScout) => {
        this.showSavingMessage(true, !!users);
        if (users) this.sendUsernamesUpdate(savedScout.id!, users);
        else this.ref.close(true);
      },
      error: () => this.loading = false
    });
  }

  private saveScout(scout: Scout): Observable<Scout> {
    return this.preScoutId ?
      this.scoutService.saveFromPreScout(scout, this.preScoutId) :
      this.scoutService.save(scout);
  }

  private updateScout(scout: Scout, users?: string[]) {
    this.loading = true;
    this.scoutService.update(scout).subscribe({
      next: () => {
        this.showSavingMessage(false, !!users);
        if (users) this.sendUsernamesUpdate(scout.id!, users);
        else this.ref.close(true);
      },
      error: () => this.loading = false
    });
  }

  private sendUsernamesUpdate(scoutId: number, users: string[]) {
    this.scoutService.updateScoutUsers(scoutId, users).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Éxito al actualizar los usuarios de la persona educanda");
        this.ref.close(true);
      },
      error: () => this.loading = false
    });
  }

  private showSavingMessage(add: boolean, users: boolean) {
    if (users) {
      this.alertService.sendMessage({
        title: 'Guardando...',
        message: `Los datos del usuario se han ${add ? 'guardado' : 'actualizado'} con éxito.
        Espere mientras se realizan los cambios a los usuario.`,
        severity: "info"
      });
    } else {
      this.alertService.sendBasicSuccessMessage(`Éxito al ${add ? 'guardar' : 'actualizar'} los datos de la persona educanda`);
    }
  }

  protected disableScout() {
    this.confirmationService.confirm({
      message: "¿Desea dar de baja a esta persona educanda? Esta acción <b>no se podrá deshacer</b>.",
      header: "Dar de baja",
      accept: () => {
        if (!this.isNew && this.scout?.id) {
          this.disableLoading = true;
          this.scoutService.disable(this.scout).subscribe({
            next: () => {
              this.alertService.sendBasicSuccessMessage("Éxito al dar de baja");
              this.ref.close(true);
            },
            error: () => this.disableLoading = false
          });
        }
      }
    });
  }

  protected contactWithoutPhoneOrEmail(): boolean {
    return this.scoutContactList.controls.some(control => control.errors && control.errors['noPhoneOrEmail']);
  }

  private generateUsernameChangeMessage(usernameInfo: ScoutUsernamesUpdate, empty: boolean) {
    let message = "<p>Se van a realizar los siguientes cambios a ciertos usuarios, ¿quiere continuar?</p>";
    if (usernameInfo.addedUsers.length > 0) {
      message += "<span>Los siguientes usuarios obtendrán acceso a la educanda:</span>";
      message += this.generateAddedUserListString(usernameInfo);
    }
    if (usernameInfo.deletedUsers.length > 0) {
      message += "<span>Los siguientes usuarios ya no tendrán acceso a la educanda:</span>";
      message += FormUtils.listToHtmlList(usernameInfo.deletedUsers, true);
    }
    if (empty) message += "<span>La educanda no tendrá usuarios asignados.</span>";
    return message;
  }

  private generateUsernameCreationMessage(usernameInfo: ScoutUsernamesUpdate) {
    let message = "<p>¿Quiere crear a esta persona educanda otorgándole su acceso a los siguientes usuarios?</p>";
    message += this.generateAddedUserListString(usernameInfo);
    return message;
  }

  private generateAddedUserListString(usernameInfo: ScoutUsernamesUpdate) {
    return FormUtils.listToHtmlList(
      usernameInfo.addedUsers.map(addedUser => this.generateAddedUserString(addedUser, usernameInfo.addedNewUsers)),
      true
    );
  }

  private generateAddedUserString(addedUser: string, addedNewUsers: string[]) {
    if (addedNewUsers.some(user => user == addedUser)) return `${addedUser} <b>¡Usuario no existente, se creará uno nuevo!</b>`;
    return addedUser;
  }

  private contactValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const name = control.get('email');
    const role = control.get('phone');
    return name && role && !name.value && !role.value ? {noPhoneOrEmail: true} : null;
  };
}
