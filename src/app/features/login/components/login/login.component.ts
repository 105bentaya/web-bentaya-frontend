import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from "../../../users/services/user.service";
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {AlertService} from "../../../../shared/services/alert-service.service";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {Credentials} from "../../../../core/auth/credentials.model";
import {FormHelper} from "../../../../shared/util/form-helper";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {UserRoutesService} from "../../../../core/auth/services/user-routes.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    SaveButtonsComponent,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly routeService = inject(UserRoutesService);

  protected loginForm: FormHelper = new FormHelper();
  protected loading = false;
  protected login = true;
  protected forgotUsername!: string;

  ngOnInit(): void {
    this.formInit();
  }

  private formInit() {
    this.loginForm.createForm({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  protected onSubmit() {
    this.loading = true;
    this.loginForm.validateAll();
    const credentials: Credentials = {...this.loginForm.value};
    this.authService.login(credentials).subscribe({
      next: () => this.routeService.navigateToLastRoute(),
      error: () => this.loading = false
    });
  }

  protected forgotPassword() {
    this.loading = true;
    this.userService.forgotPassword(this.forgotUsername).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage(
          `El usuario ${this.forgotUsername} ha recibido un correo, en caso de que este exista`
        );
        this.loading = false;
        this.login = true;
      },
      error: () => this.loading = false
    });
  }
}
