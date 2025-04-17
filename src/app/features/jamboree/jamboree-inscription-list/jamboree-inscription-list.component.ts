import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {JamboreeService} from "../jamboree.service";
import {FileUtils} from "../../../shared/util/file.utils";

@Component({
  selector: 'app-jamboree-inscription-list',
  imports: [
    Button
  ],
  templateUrl: './jamboree-inscription-list.component.html',
  styleUrl: './jamboree-inscription-list.component.scss'
})
export class JamboreeInscriptionListComponent {

  private readonly jamboreeService = inject(JamboreeService);

  protected downloadExcelFile() {
    this.jamboreeService.getExcel().subscribe(res => FileUtils.downloadFile(res));
  }
}
