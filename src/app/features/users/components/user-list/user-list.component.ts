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
import {ButtonDirective} from 'primeng/button';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {MultiSelectModule} from "primeng/multiselect";
import {RolesPipe} from "../../../../shared/pipes/roles.pipe";
import FilterUtils from "../../../../shared/util/filter-utils";
import {
  GeneralIconButtonComponent
} from "../../../../shared/components/general-icon-button/general-icon-button.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    RouterLink,
    CheckboxModule,
    InputTextModule,
    MultiSelectModule,
    TableModule,
    RolePipe,
    RolesPipe,
    GeneralIconButtonComponent
  ]
})
export class UserListComponent {

  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private alertService = inject(AlertService);

  @ViewChild('dt')
  private dt!: Table;
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
      error: () => this.sendErrorMessage("Error al buscar usuarios")
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
          error: () => this.sendErrorMessage("Error al actualizar el usuario")
        });
      }
    });
  }

  private sendErrorMessage(msg: string) {
    this.alertService.sendMessage({
      title: "Error",
      message: msg,
      severity: "error"
    });
    this.loading = false;
  }
}
