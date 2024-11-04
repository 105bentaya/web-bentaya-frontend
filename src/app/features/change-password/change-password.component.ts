import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {UserService} from '../users/services/user.service';
import {PasswordModule} from 'primeng/password';
import {AlertService} from "../../shared/services/alert-service.service";
import {SaveButtonsComponent} from "../../shared/components/save-buttons/save-buttons.component";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    SaveButtonsComponent
  ]
})
//todo merge with reset-password
export class ChangePasswordComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private alertService = inject(AlertService);
  private userService = inject(UserService);

  protected changePasswordForm!: FormGroup;
  protected loading = false;
  private passwordRegex: RegExp = /^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\d)(?!.*\s).{8,}$/;
  protected may: RegExp = /.*[A-ZÑ].*/;
  protected min: RegExp = /.*[a-zñ].*/;
  protected dig: RegExp = /.*\d.*/;
  protected space: RegExp = /^\S*$/;
  protected len: RegExp = /.{8,}/;

  ngOnInit(): void {
    this.formInit();
  }

  protected checkPasswordRegex(regex: RegExp) {
    return this.changePasswordForm.get('newPassword')?.value.match(regex) ? 'green' : 'red';
  }

  private formInit() {
    this.changePasswordForm = this.formBuilder.group({
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.pattern(this.passwordRegex)]],
        newPasswordRepeat: [""]
    }, {
        validators: this.validateNewPasswordRepeat
    });
  }

  protected onSubmit() {
    if (this.changePasswordForm.controls["newPassword"].value == "fake_password") {
      this.alertService.sendBasicErrorMessage("La nueva contraseña no es válida");
      return;
    }
    this.loading = true;
    this.userService.changePassword({...this.changePasswordForm.value}).subscribe({
      next: () => {
        this.alertService.sendBasicSuccessMessage("Contraseña cambiada con éxito");
        this.ref.close();
      },
      error: () => this.loading = false
    });
  }

  private validateNewPasswordRepeat: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return control.get('newPasswordRepeat')!.value !== control.get('newPassword')!.value ? {passwordRepeat: true} : null;
  };
}
