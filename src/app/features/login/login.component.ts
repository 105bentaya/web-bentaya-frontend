import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {UserService} from "../users/services/user.service";
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {AlertService} from "../../shared/services/alert-service.service";
import {AuthService} from "../../core/auth/services/auth.service";
import {Credentials} from "../../core/auth/credentials.model";
import {FormHelper} from "../../shared/util/form-helper";
import {SaveButtonsComponent} from "../../shared/components/save-buttons/save-buttons.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    SaveButtonsComponent,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private ref = inject(DynamicDialogRef);
  private alertService = inject(AlertService);

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
      next: () => {
        this.ref.close(true);
      },
      error: () => this.loading = false
    });
  }

  protected forgotPassword() {
    this.loading = true;
    this.userService.forgotPassword(this.forgotUsername).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage(`El usuario ${this.forgotUsername} ha recibido un correo, en caso de que este exista`);
        this.ref.close();
      },
      error: () => this.loading = false
    });
  }
}
