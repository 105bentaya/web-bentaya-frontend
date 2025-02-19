import {Component, inject, Input} from '@angular/core';
import {ScoutService} from "../../services/scout.service";
import {FormControl, FormsModule, Validators} from "@angular/forms";
import {NgClass} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";

@Component({
  selector: 'app-scout-user-form-list',
  templateUrl: './scout-user-form-list.component.html',
  styleUrls: ['./scout-user-form-list.component.scss'],
  imports: [
    TableModule,
    InputTextModule,
    FormsModule,
    NgClass,
    TableIconButtonComponent
  ]
})
export class ScoutUserFormListComponent {
  private readonly scoutService = inject(ScoutService);

  @Input() scoutId: number | undefined;
  private originalUsers!: string[];
  public users!: { username: string }[];

  public loadUsers() {
    if (!this.scoutId) {
      this.users = [];
    } else {
      this.scoutService.getScoutUsernames(this.scoutId).subscribe(data => {
        this.originalUsers = data;
        this.users = data.map(user => ({username: user}));
      });
    }
  }

  public usersHaveChanged() {
    if (!this.users) return false;
    if (this.originalUsers.length != this.users.length) return true;
    return this.users.some(newUsers => !this.originalUsers.some(username => newUsers.username == username));
  }

  public getUsernames(): string[] {
    return this.users?.map(user => user.username);
  }

  protected addUser() {
    this.users.push({username: ''});
  }

  protected deleteUser(index: number) {
    this.users.splice(index, 1);
  }

  public usersAreValid() {
    if (this.users) {
      return !this.users.some(
        user => user.username.trim().length == 0 ||
          new FormControl(user.username, Validators.email).invalid
      ) && !this.hasDuplicateUsernames();
    }
    return true;
  }

  private hasDuplicateUsernames(): boolean {
    const usernames = new Set<string>();
    for (const user of this.users) {
      if (usernames.has(user.username)) {
        return true;
      }
      usernames.add(user.username);
    }
    return false;
  }
}
