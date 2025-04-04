import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';
import {DialogService} from "primeng/dynamicdialog";
import {OwnBookingFormComponent} from "../own-booking-form/own-booking-form.component";
import {DynamicDialogService} from "../../../../../shared/services/dynamic-dialog.service";
import {BookingManagementService} from "../../../service/booking-management.service";
import {noop} from "rxjs";
import {
  GeneralAButtonComponent
} from "../../../../../shared/components/buttons/general-a-button/general-a-button.component";

@Component({
  selector: 'app-booking-management-menu',
  templateUrl: './booking-management-menu.component.html',
  styleUrls: ['./booking-management-menu.component.scss'],
  imports: [
    Button,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    GeneralAButtonComponent
  ],
  providers: [DialogService, DynamicDialogService]
})
export class BookingManagementMenuComponent implements OnInit {

  private readonly dialogService = inject(DynamicDialogService);
  private readonly bookingManagement = inject(BookingManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly options = [
    {label: "Resumen", route: "pendientes", icon: 'pi pi-clock'},
    {label: "Calendario", route: "calendario", icon: 'pi pi-calendar'},
    {label: "Todas", route: "lista", icon: 'pi pi-list'}
  ];

  protected readonly isManager: boolean;
  protected readonly title: string;

  constructor() {
    this.isManager = this.route.snapshot.data['isManager'];
    this.title = this.isManager ? 'Gestor de Centros Scout' : 'Seguimiento de Reservas';
    if (this.isManager) {
      this.options[0].label = "Pendientes";
      this.options[2].label = "Lista";
    }
  }

  ngOnInit(): void {
    if (this.router.url.endsWith("gestion")) this.router.navigate(["pendientes"], {
      replaceUrl: true,
      relativeTo: this.route,
      queryParamsHandling: "preserve"
    });
  }

  protected openOwnBookingDialog() {
    const ref = this.dialogService.openDialog(OwnBookingFormComponent, 'Añadir Reserva Propia', "medium");
    ref.onClose.subscribe(saved => saved ? this.bookingManagement.updateBooking() : noop());
  }
}
