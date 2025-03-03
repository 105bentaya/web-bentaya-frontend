import {Component, inject, OnInit} from '@angular/core';
import {SeniorForm} from "../../senior-form.model";
import {SeniorSectionService} from "../../senior-section.service";
import {ConfirmationService, FilterService} from "primeng/api";
import FilterUtils from "../../../../shared/util/filter-utils";
import {ExcelService} from "../../../../shared/services/excel.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {InputTextModule} from "primeng/inputtext";
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";

@Component({
  selector: 'app-senior-form-list',
  templateUrl: './senior-form-list.component.html',
  styleUrls: ['./senior-form-list.component.scss'],
  imports: [
    BasicLoadingInfoComponent,
    TableModule,
    InputTextModule,
    TableIconButtonComponent,
    Button
  ]
})
export class SeniorFormListComponent implements OnInit {

  private readonly seniorService = inject(SeniorSectionService);
  private readonly filterService = inject(FilterService);
  private readonly excelService = inject(ExcelService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly alertService = inject(AlertService);

  protected data!: SeniorForm[];
  protected excelLoading = false;
  protected loading = false;

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.seniorService.findAll().subscribe(data => {
      this.data = data;
      this.filterService.register("custom-filter", FilterUtils.nameSurnameIdFilter(this.data));
    });
  }

  protected exportExcel() {
    this.excelLoading = true;
    this.excelService.exportAsExcel(
      this.data.map(pre => ({
        id: pre.id!.toString(), name: pre.name, surname: pre.surname,
        email: pre.email, phone: pre.phone, acc: pre.acceptMessageGroup ? "SÍ" : "NO",
        accN: pre.acceptNewsletter ? "SÍ" : "NO", obs: pre.observations
      })),
      ["ID", "Nombre", "Apellidos", "Correo", "Teléfono",
        "Acepta Pertenecer a Grupos de Mensajería", "Acepta Recibir Información y Novedades",
        "Observaciones"],
      "sección-senior"
    );
    this.excelLoading = false;
  }

  protected deleteForm(form: SeniorForm) {
    this.confirmationService.confirm({
      message: "¿Desea borrar este formulario? Esta acción no se podrá deshacer.",
      header: "Eliminar",
      accept: () => {
        if (form.id) {
          this.loading = true;
          this.seniorService.delete(form.id).subscribe({
            next: () => {
              this.alertService.sendBasicSuccessMessage("Formulario borrado con éxito");
              this.getData();
            },
            error: () => this.loading = false
          });
        }
      }
    });
  }
}
