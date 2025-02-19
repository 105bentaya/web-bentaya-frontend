import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../users/services/user.service";
import {ForgotPassword} from "./forgot-password.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {CardModule} from 'primeng/card';
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    CardModule,
    PasswordModule,
    FormsModule,
    SaveButtonsComponent
  ]
})
export class ResetPasswordComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  protected loading = false;
  private token!: string;
  protected password: string = "";
  protected repeat!: string;
  protected passwordRegex: RegExp = /^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\d)(?!.*\s).{8,}$/;
  protected may: RegExp = /.*[A-ZÑ].*/;
  protected min: RegExp = /.*[a-zñ].*/;
  protected dig: RegExp = /.*\d.*/;
  protected space: RegExp = /^\S*$/;
  protected len: RegExp = /.{8,}/;

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
  }

  protected checkPasswordRegex(regex: RegExp) {
    return this.password.match(regex) ? 'green' : 'red';
  }

  protected resetPassword() {
    if (this.password === this.repeat && this.password.match(this.passwordRegex)) {
      this.loading = true;
      const dto: ForgotPassword = {token: this.token, newPassword: this.password, newPasswordRepeat: this.repeat};
      this.userService.resetPassword(dto).subscribe({
        next: () => {
          this.alertService.sendBasicSuccessMessage("La contraseña ha sido cambiada con éxito");
          this.router.navigate(["inicio"]).then();
        },
        error: () => this.loading = false
      });
    }
  }
}
