import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {UserService} from '../../services/user.service';
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {ScoutService} from "../../../scouts/services/scout.service";
import {roles} from "../../models/role.model";
import {SelectModule} from 'primeng/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {RolePipe} from "../../../../shared/pipes/role.pipe";
import {RolesPipe} from "../../../../shared/pipes/roles.pipe";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {FormHelper} from "../../../../shared/util/form-helper";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {UserForm} from "../../models/user-form.model";
import {FloatLabel} from "primeng/floatlabel";
import {GroupService} from "../../../../shared/services/group.service";
import {ScoutListData} from "../../../scouts/models/scout.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    MultiSelectModule,
    RolesPipe,
    RolePipe,
    SelectModule,
    SaveButtonsComponent,
    BasicLoadingInfoComponent,
    FloatLabel,
    DatePipe
  ]
})
export class UserFormComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly scoutService = inject(ScoutService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly groupService = inject(GroupService);

  protected readonly roles = roles;
  protected userForm = new FormHelper();
  protected userRoleScouts!: ScoutListData[];
  protected scouterRoleScouts!: ScoutListData[];
  protected groups!: BasicGroupInfo[];
  protected user!: UserForm;
  protected loading = false;

  ngOnInit(): void {
    this.groupService.getBasicGroups({uppercase: true}).subscribe(groups => this.groups = groups);
    const userId = this.route.snapshot.params['userId'];
    if (userId === "new") {
      this.newForm();
    } else {
      this.getUserById(userId);
    }
  }

  private newForm() {
    this.userForm.createForm({
      username: [this.user?.username, Validators.required],
      password: [this.user?.password, Validators.required],
      roles: [this.user?.roles, Validators.required],
      scouterId: [this.user?.scouterId, this.groupIdValidator],
      scoutIds: [this.user?.scoutIds, this.scoutListValidator],
    });
  }

  private readonly groupIdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.isScouter() && !control.value ? {noGroup: true} : null;
  };

  private readonly scoutListValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.isUser() && (!control.value || control.value.length < 1) ? {noGroup: true} : null;
  };

  private saveOrUpdateUser(): Observable<UserForm> {
    const userToUpdate: UserForm = {...this.userForm.value};
    return this.user ? this.userService.update(userToUpdate, this.user.id!) : this.userService.save(userToUpdate);
  }

  protected onSubmit() {
    this.userForm.validateAll();
    if (this.userForm.valid) {
      this.loading = true;
      this.saveOrUpdateUser().subscribe({
        next: savedUser => {
          this.alertService.sendMessage({
            title: "Usuario guardado",
            severity: 'success'
          });
          this.loading = false;
          this.user = savedUser;
          this.router.navigateByUrl(`usuarios/${savedUser.id}`);
        },
        error: () => this.loading = false
      });
    }
  }

  protected goBack() {
    this.router.navigate(['usuarios']).then();
  }

  protected isScouter() {
    return this.userForm.controlValue("roles")?.includes("ROLE_SCOUTER");
  }

  protected isUser() {
    return this.userForm.controlValue("roles")?.includes("ROLE_USER");
  }

  private getUserById(userId: any): void {
    this.userService.findFormById(userId).subscribe({
      next: user => {
        this.user = user;
        this.newForm();
        this.onRolesChange();
      }
    });
  }

  protected onRolesChange() {
    if (!this.userRoleScouts && this.isUser()) this.getScouts();
    if (!this.scouterRoleScouts && this.isScouter()) this.getScouters();
  }

  private getScouts() {
    return this.scoutService.getAllForUserEdition(["SCOUT"]).subscribe(result => this.userRoleScouts = result);
  }

  private getScouters() {
    return this.scoutService.getAllForUserEdition(["SCOUTER", "MANAGER", "COMMITTEE"]).subscribe(result => this.scouterRoleScouts = result);
  }
}
