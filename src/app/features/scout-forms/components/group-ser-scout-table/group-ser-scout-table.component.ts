import {Component, inject, OnInit} from '@angular/core';
import {PreScout} from "../../models/pre-scout.model";
import {ScoutFormsService} from "../../scout-forms.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AssignPreScoutFormComponent} from "../assign-pre-scout-form/assign-pre-scout-form.component";
import {PreScoutAssignation} from "../../models/pre-scout-assignation.model";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {statuses, statusIsRejected, statusIsSaveAsScout, statusIsValidForSaving} from "../../models/satus.model";
import {FilterService} from "primeng/api";
import FilterUtils from "../../../../shared/util/filter-utils";
import {StatusPipe} from '../../../../shared/pipes/status.pipe';
import {FormsModule} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from "primeng/togglebutton";
import {
  TableIconButtonComponent
} from "../../../../shared/components/buttons/table-icon-button/table-icon-button.component";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-group-ser-scout-table',
  templateUrl: './group-ser-scout-table.component.html',
  styleUrls: ['./group-ser-scout-table.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    ToggleButtonModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    StatusPipe,
    FormsModule,
    TableIconButtonComponent
  ]
})
export class GroupSerScoutTableComponent implements OnInit {

  private readonly preScoutService = inject(ScoutFormsService);
  private readonly dialogService = inject(DynamicDialogService);
  private readonly alertService = inject(AlertService);
  private readonly filterService = inject(FilterService);
  private readonly router = inject(Router);

  private allPreScouts!: PreScout[];
  protected filteredPreScouts!: PreScout[];
  protected loading = false;

  protected hasRejected = false;
  protected showRejected = false;

  private ref!: DynamicDialogRef;
  protected statuses = statuses.slice(0, 4);

  ngOnInit(): void {
    this.getAssignedInscriptions();
  }

  private getAssignedInscriptions() {
    this.preScoutService.getAllByScouter().subscribe(preScouts => {
      this.allPreScouts = preScouts.sort((a, b) => this.preScouterSorter(a, b));
      this.filterService.register("name-surname-filter", FilterUtils.nameSurnameFilter(this.allPreScouts));
      this.hasRejected = this.allPreScouts.some(preScout => statusIsRejected(preScout.assignation!.status));
      this.filterRejected(this.showRejected);
      this.loading = false;
    });
  }

  private preScouterSorter(ps1: PreScout, ps2: PreScout) {
    return new Date(ps1.assignation!.assignationDate!).toISOString().localeCompare(new Date(ps2.assignation!.assignationDate!).toISOString());
  }

  protected downloadPreScoutAsPdf(preScout: PreScout) {
    const newTab = window.open("", "_blank");
    this.preScoutService.getPreScoutPDF(preScout.id!).subscribe({
      next: pdf => newTab!.location.href = this.blobPdfToUrl(pdf),
      error: () => newTab?.close()
    });
  }

  private blobPdfToUrl(pdf: Blob): string {
    return URL.createObjectURL(new Blob([pdf], {type: 'application/pdf'}));
  }

  protected openForm(preScout: PreScout) {
    this.ref = this.dialogService.openDialog(AssignPreScoutFormComponent, `Editar Asignación - ${preScout.name}`, "small", {preScout});
    this.ref.onClose.subscribe(result => {
      if (result) this.saveAssignation(result, preScout);
    });
  }

  private saveAssignation(preScoutAssignation: PreScoutAssignation, preScout: PreScout) {
    if (statusIsSaveAsScout(preScoutAssignation.status)) {
      this.router.navigateByUrl(`/scouts/alta/${preScout.id}`);
    } else if (statusIsValidForSaving(preScoutAssignation.status)) {
      this.loading = true;
      this.preScoutService.updatePreScoutAssignation(preScoutAssignation).subscribe({
          next: () => {
            this.alertService.sendBasicSuccessMessage("Preinscripción guardada con éxito");
            this.getAssignedInscriptions();
          },
          error: () => this.loading = false
        }
      );
    } else {
      this.alertService.sendBasicErrorMessage("El estado de la preinscripción no es válido");
    }
  }

  protected filterRejected(showRejected: boolean) {
    if (showRejected) {
      this.filteredPreScouts = this.allPreScouts;
    } else {
      this.filteredPreScouts = this.allPreScouts.filter(preScouts => !statusIsRejected(preScouts.assignation!.status));
    }
  }
}
