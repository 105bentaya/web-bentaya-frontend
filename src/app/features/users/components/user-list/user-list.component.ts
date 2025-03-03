import {Component, inject, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {Table, TableModule} from "primeng/table";
import {roles} from "../../models/role.model";
import {RolePipe} from '../../../../shared/pipes/role.pipe';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {MultiSelectModule} from "primeng/multiselect";
import {RolesPipe} from "../../../../shared/pipes/roles.pipe";
import FilterUtils from "../../../../shared/util/filter-utils";
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    RouterLink,
    CheckboxModule,
    InputTextModule,
    MultiSelectModule,
    TableModule,
    RolePipe,
    RolesPipe,
    TableIconButtonComponent,
    Button,
    CheckboxContainerComponent
  ]
})
export class UserListComponent {

  private readonly userService = inject(UserService);
  private readonly confirmationService = inject(ConfirmationService);

  @ViewChild('dt') private readonly dt!: Table;
  protected totalRecords: number = 0;
  protected loading = true;
  protected readonly roles = roles;
  protected userList!: User[];

  protected loadUsersWithFilter(tableLazyLoadEvent: any) {
    this.loading = true;
    this.userService.getAll(FilterUtils.lazyEventToFilter(tableLazyLoadEvent)).subscribe({
      next: users => {
        this.userList = users.data;
        this.totalRecords = users.count;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  protected deleteUser(id: any) {
    this.confirmationService.confirm({
      message: "¿Desea desactivar este usuario?",
      header: "Desactivar",
      accept: () => {
        this.loading = true;
        this.userService.delete(id).subscribe({
          next: () => this.dt._filter(),
          error: () => this.loading = false
        });
      }
    });
  }
}
