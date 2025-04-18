import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {JamboreeService} from "../jamboree.service";
import {FileUtils} from "../../../shared/util/file.utils";
import {RouterLink} from "@angular/router";
import {GeneralAButtonComponent} from "../../../shared/components/buttons/general-a-button/general-a-button.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-jamboree-inscription-list',
  imports: [
    Button,
    RouterLink,
    GeneralAButtonComponent
  ],
  templateUrl: './jamboree-inscription-list.component.html',
  styleUrl: './jamboree-inscription-list.component.scss'
})
export class JamboreeInscriptionListComponent {

  private readonly jamboreeService = inject(JamboreeService);
  protected loading = false;

  protected downloadExcelFile() {
    this.loading = true;
    this.jamboreeService.getExcel()
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => FileUtils.downloadFile(res));
  }
}
