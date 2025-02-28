import {Component, inject, OnInit} from '@angular/core';
import {PreScouter} from "../../../scout-forms/models/pre-scouter.model";
import {ScouterFormsService} from "../../scouter-forms.service";
import {ConfirmationService} from "primeng/api";
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-ser-scouter-table',
  templateUrl: './ser-scouter-table.component.html',
  styleUrls: ['./ser-scouter-table.component.scss'],
  imports: [
    TableModule,
    Button
  ]
})
export class SerScouterTableComponent implements OnInit {

  private preScouterService = inject(ScouterFormsService);
  private confirmationService = inject(ConfirmationService);

  protected preScouters!: PreScouter[];
  protected loading = false;

  ngOnInit(): void {
    this.getPreScouters();
  }

  private getPreScouters() {
    this.preScouterService.getAll().subscribe(preScouters => this.preScouters = preScouters);
  }

  protected deleteScouter(event: any, preScouter: PreScouter) {
    this.confirmationService.confirm({
      target: event.target,
      message: "¿Desea borrar a este voluntario? Esta acción no se podrá deshacer.",
      header: "Eliminar",
      accept: () => {
        if (preScouter.id) {
          this.loading = true;
          this.preScouterService.deleteById(preScouter.id).subscribe({
            next: () => {
              this.getPreScouters();
              this.loading = false;
            },
            error: () => this.loading = false
          });
        }
      }
    });
  }

  protected downloadPreScouterAsPdf(preScouter: PreScouter) {
    const newTab = window.open("", "_blank");
    this.preScouterService.getPreScouterPDF(preScouter.id!).subscribe(pdf => {
      newTab!.location.href = URL.createObjectURL(new Blob([pdf], {type: 'application/pdf'}));
    });
  }
}
