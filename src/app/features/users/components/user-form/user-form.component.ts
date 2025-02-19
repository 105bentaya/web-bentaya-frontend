import {DatePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {unitGroups} from "../../../../shared/model/group.model";
import {Scout} from "../../../scouts/models/scout.model";
import {ScoutService} from "../../../scouts/services/scout.service";
import {roles} from "../../models/role.model";
import {SelectModule} from 'primeng/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {RolePipe} from "../../../../shared/pipes/role.pipe";
import {RolesPipe} from "../../../../shared/pipes/roles.pipe";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {JoinPipe} from "../../../../shared/pipes/join.pipe";
import {FormHelper} from "../../../../shared/util/form-helper";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {UserForm} from "../../models/user-form.model";

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
    DatePipe,
    JoinPipe,
    SaveButtonsComponent,
    BasicLoadingInfoComponent
  ]
})
export class UserFormComponent implements OnInit {

  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private scoutService = inject(ScoutService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly roles = roles;
  protected userForm = new FormHelper();
  protected scouts!: Scout[];
  protected groups = unitGroups;
  private userId!: string;
  protected user!: UserForm;
  protected loading = false;

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    if (this.userId === "new") this.newForm();
    else this.getUserById();
  }

  private newForm() {
    this.userForm.createForm({
      username: [this.user?.username, Validators.required],
      password: [this.user?.password, Validators.required],
      roles: [this.user?.roles, Validators.required],
      groupId: [this.user?.groupId, this.groupIdValidator],
      scoutIds: [this.user?.scoutIds, this.scoutListValidator],
    });
  }

  private groupIdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.isScouter() && !control.value ? {noGroup: true} : null;
  };

  private scoutListValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.isUser() && (!control.value || control.value.length < 1) ? {noGroup: true} : null;
  };

  private saveOrUpdateUser(): Observable<User> {
    const userToUpdate: UserForm = {...this.userForm.value};
    if (this.user) {
      userToUpdate.enabled = this.user.enabled;
      return this.userService.update(userToUpdate, this.userId);
    } else {
      userToUpdate.enabled = true;
      return this.userService.save(userToUpdate);
    }
  }

  protected onSubmit() {
    this.userForm.validateAll();
    if (this.userForm.valid) {
      this.loading = true;
      this.saveOrUpdateUser().subscribe({
        next: () => {
          this.alertService.sendMessage({
            title: "Usuario guardado",
            severity: 'success'
          });
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  protected goBack() {
    this.router.navigate(['users']).then();
  }

  protected isScouter() {
    return this.userForm.controlValue("roles")?.includes("ROLE_SCOUTER");
  }

  protected isUser() {
    return this.userForm.controlValue("roles")?.includes("ROLE_USER");
  }

  private getUserById(): void {
    this.userService.findFormById(this.userId).subscribe({
      next: user => {
        this.user = user;
        if (user.scoutIds?.length! > 0) this.getScouts().subscribe(() => this.newForm());
        else this.newForm();
      }
    });
  }

  protected onRolesChange() {
    if (!this.scouts && this.isUser()) this.getScouts().subscribe();
  }

  private getScouts() {
    return this.scoutService.getAll().pipe(
      map(result => this.scouts = result)
    );
  }
}
