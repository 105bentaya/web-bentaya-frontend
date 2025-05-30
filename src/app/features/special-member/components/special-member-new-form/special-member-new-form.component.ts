import {Component, inject} from '@angular/core';
import {SpecialMemberFormComponent} from "../special-member-form/special-member-form.component";
import {finalize} from "rxjs";
import {SpecialMemberForm} from "../../models/special-member-form.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {SpecialMemberService} from "../../special-member.service";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-special-member-new-form',
  imports: [
    SpecialMemberFormComponent
  ],
  templateUrl: './special-member-new-form.component.html',
  styleUrl: './special-member-new-form.component.scss'
})
export class SpecialMemberNewFormComponent {
  private readonly specialMemberService = inject(SpecialMemberService);
  private readonly alertService = inject(AlertService);
  protected readonly router = inject(Router);
  protected readonly location = inject(Location);

  protected loading = false;

  onSave(form: SpecialMemberForm) {
    this.specialMemberService.saveSpecialMember(form)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.alertService.sendBasicSuccessMessage("Registro guardado");
        this.router.navigateByUrl(`/registros/${res.id}`, {replaceUrl: true});
      });
  }
}
