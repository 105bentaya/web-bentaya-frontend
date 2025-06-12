import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Scout} from "../../../models/scout.model";
import {FormHelper} from "../../../../../shared/util/form-helper";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SaveButtonsComponent} from "../../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {InputText} from "primeng/inputtext";
import {Tag} from "primeng/tag";
import {
  CheckboxContainerComponent
} from "../../../../../shared/components/checkbox-container/checkbox-container.component";
import {Checkbox} from "primeng/checkbox";
import {Button} from "primeng/button";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {ScoutService} from "../../../services/scout.service";
import {ConfirmationService} from "primeng/api";
import FormUtils from "../../../../../shared/util/form-utils";
import {finalize} from "rxjs";

@Component({
  selector: 'app-scout-users-form',
  imports: [
    ReactiveFormsModule,
    SaveButtonsComponent,
    InputText,
    Tag,
    CheckboxContainerComponent,
    Checkbox,
    FormsModule,
    Button,
    InputGroup,
    InputGroupAddon
  ],
  templateUrl: './scout-users-form.component.html',
  styleUrl: './scout-users-form.component.scss'
})
export class ScoutUsersFormComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  protected readonly ref = inject(DynamicDialogRef);
  protected readonly formHelper = new FormHelper();
  private readonly formBuilder = inject(FormBuilder);
  private readonly scoutService = inject(ScoutService);
  private readonly confirmationService = inject(ConfirmationService);

  protected scout!: Scout;

  protected scoutEmail: string | undefined;
  protected scoutEmailAssigned: boolean = false;
  protected contactEmails: { assigned: boolean; email: string }[] = [];
  protected loading: boolean = false;

  ngOnInit() {
    this.scout = this.config.data.scout;

    const scoutUsers = this.scout.usernames;
    this.scoutEmail = this.scout.personalData.email;

    if (this.scoutType !== "INACTIVE") {
      if (this.scoutEmail) {
        this.scoutEmailAssigned = scoutUsers.includes(this.scoutEmail);
      }
      if (this.scoutType === "SCOUT") {
        const scoutContactList = this.scout.contactList.filter(contact => contact.email);
        this.contactEmails = scoutContactList.map(contact => ({
          assigned: scoutUsers.includes(contact.email!),
          email: contact.email!
        }));
        const otherEmails = scoutUsers.filter(email =>
          email !== this.scoutEmail &&
          !scoutContactList.some(contact => contact.email === email)
        );
        this.createForm(otherEmails);
      }
    }
  }

  private createForm(otherEmails: string[]) {
    this.formHelper.createForm({
      otherUsers: this.formBuilder.array(otherEmails.map(email => this.createOtherUserControl(email)))
    });
  }

  protected addOtherUser(email?: string) {
    this.otherUsersArray.push(this.createOtherUserControl(email));
  }

  protected deleteOtherUser(index: number) {
    this.otherUsersArray.removeAt(index);
  }

  get otherUsersArray() {
    return this.formHelper.getFormArray("otherUsers");
  }

  get scoutType() {
    return this.scout.scoutInfo.scoutType;
  }

  private createOtherUserControl(email?: string) {
    return new FormControl(email, [Validators.required, Validators.email]);
  }

  protected submit() {
    if (this.scoutType !== "SCOUT" || this.formHelper.validateAll()) {
      this.loading = true;

      let users: string[] = [];
      if (this.scoutType === "SCOUT") {
        const otherUsers = this.formHelper.value.otherUsers.map((email: string) => email);
        const contactUsers = this.contactEmails
          .filter(contact => contact.assigned)
          .map(contact => contact.email);
        users = contactUsers.concat(otherUsers);
      }

      if (this.scoutEmailAssigned && this.scoutEmail) {
        users.push(this.scoutEmail);
      }

      const userSet = new Set<string>();
      users.forEach(user => userSet.add(user));
      const scoutUsers = Array.from(userSet);

      this.scoutService.getNewUsers(scoutUsers).subscribe({
        next: newUsers => this.confirm(scoutUsers, newUsers),
        error: () => this.loading = false
      });
    }
  }

  private confirm(users: string[], newUsers: string[]) {
    this.confirmationService.confirm({
      header: "Actualizar usuarios",
      message: this.generateUsernameChangeMessage(users, newUsers),
      accept: () => this.saveUsers(users),
      reject: () => this.loading = false
    });
  }

  private saveUsers(usernames: string[]) {
    this.scoutService.updateScoutUsers(this.scout.id, usernames)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => this.ref.close(res));
  }

  private generateUsernameChangeMessage(users: string[], newUsers: string[]) {
    const addedUsers = users.filter(user => !this.scout.usernames.includes(user));
    const deletedUsers = this.scout.usernames.filter(user => !users.includes(user));

    let message = "<p>Se van a realizar los siguientes cambios, ¿quiere continuar?</p>";
    if (addedUsers.length > 0) {
      message += "<span>Los siguientes usuarios obtendrán acceso a la asociada:</span>";
      message += this.generateAddedUserListString(addedUsers, newUsers);
    }
    if (deletedUsers.length > 0) {
      message += "<span>Los siguientes usuarios ya no tendrán acceso a la asociada:</span>";
      message += FormUtils.listToHtmlList(deletedUsers, true);
    }
    if (users.length === 0) message += "<span>La asociada <b>no tendrá</b> usuarios asignados.</span>";
    return message;
  }

  private generateAddedUserListString(addedUsers: string[], newUsers: string[]) {
    return FormUtils.listToHtmlList(
      addedUsers.map(addedUser => this.generateAddedUserString(addedUser, newUsers)),
      true
    );
  }

  private generateAddedUserString(addedUser: string, newUsers: string[]) {
    if (newUsers.some(user => user == addedUser)) return `${addedUser} <b>¡Usuario no existente, se creará uno nuevo!</b>`;
    return addedUser;
  }
}
