import {Route, Routes} from '@angular/router';
import {TransparenciaComponent} from "./web-pages/transparencia/transparencia.component";
import {
  GestionEconomicaComponent
} from "./web-pages/transparencia/components/gestion-economica/gestion-economica.component";
import {CargosComponent} from "./web-pages/transparencia/components/cargos/cargos.component";
import {AsociacionComponent} from "./web-pages/asociacion/asociacion.component";
import {authGuard} from "./core/auth/guards/auth.guard";
import {noAuthGuard} from "./core/auth/guards/no-auth.guard";
import {HistoriaComponent} from "./web-pages/historia/historia.component";
import {MisionVisionValoresComponent} from "./web-pages/mision-vision-valores/mision-vision-valores.component";
import {ReconocimientosComponent} from "./web-pages/reconocimientos/reconocimientos.component";
import {UserRole} from "./features/users/models/role.model";
import {UnidadesComponent} from "./web-pages/unidades/unidades.component";
import {
  PendingBookingsComponent
} from "./features/booking/components/management/pending-bookings/pending-bookings.component";
import {BookingListComponent} from "./features/booking/components/management/booking-list/booking-list.component";
import {
  BookingManagementCalendarComponent
} from "./features/booking/components/management/booking-management-calendar/booking-management-calendar.component";
import {inject} from "@angular/core";
import {UserRoutesService} from "./core/auth/services/user-routes.service";

export const routes: Routes = [
  {
    path: "inicio",
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: "",
    redirectTo: "inicio",
    pathMatch: "full"
  },
  {
    path: "calendario",
    loadComponent: () => import('./features/calendar/components/calendar/calendar.component').then(c => c.CalendarComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER, UserRole.USER]}
  },
  {
    path: "login",
    loadComponent: () => import('./features/login/components/login/login.component').then(c => c.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: "unauthorized",
    loadComponent: () => import('./core/auth/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.EDITOR]}
  },
  //todo: merge with change-password
  {
    path: "restablecer-clave/:token",
    loadComponent: () => import('./features/login/components/reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
    canActivate: [noAuthGuard]
  },
  //ADMIN
  {
    path: "ajustes",
    loadComponent: () => import('./features/settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  {
    path: "usuarios",
    loadComponent: () => import('./features/users/components/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  {
    path: "usuarios/:userId",
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  {
    path: "usuarios/new",
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  {
    path: "preinscripciones",
    loadComponent: () => import('./features/scout-forms/components/ser-scout-table/ser-scout-table.component').then(c => c.SerScoutTableComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.FORM]}
  },
  {
    path: "voluntariado",
    loadComponent: () => import('./features/scouter-forms/components/ser-scouter-table/ser-scouter-table.component').then(c => c.SerScouterTableComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.FORM]}
  },
  {
    path: "educandas",
    loadComponent: () => import('./features/scouts/components/scout-list/scout-list.component').then(c => c.ScoutListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  {
    path: "registros",
    loadComponent: () => import('./features/scouts/components/special-member-list/special-member-list.component').then(c => c.SpecialMemberListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.ADMIN]}
  },
  //Unidad
  {
    path: "unidad/educandas",
    loadComponent: () => import('./features/scouts/components/group-scout-list/group-scout-list.component').then(c => c.GroupScoutListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER]}
  },
  {
    path: "unidad/educandas/:id",
    loadComponent: () => import('./features/scouts/components/scout-info/scout-info.component').then(c => c.ScoutInfoComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER]}
  },
  {
    path: "unidad/asistencias",
    loadComponent: () => import('./features/attendance/components/scouter-attendance-list/scouter-attendance-list.component').then(c => c.ScouterAttendanceListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER]}
  },
  {
    path: "unidad/preinscripciones",
    loadComponent: () => import('./features/scout-forms/components/group-ser-scout-table/group-ser-scout-table.component').then(c => c.GroupSerScoutTableComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER]}
  },
  {
    path: "unidad/centros-scout",
    loadComponent: () => import('./features/scout-forms/components/group-ser-scout-table/group-ser-scout-table.component').then(c => c.GroupSerScoutTableComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER]}
  },
  //Usuario
  {
    path: "asistencias",
    loadComponent: () => import('./features/attendance/components/user-attendance-list/user-attendance-list.component').then(c => c.UserAttendanceListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.USER]}
  },
  {
    path: "datos",
    loadComponent: () => import('./features/scouts/components/user-scout-info/user-scout-info.component').then(c => c.UserScoutInfoComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.USER]}
  },
  //Donaciones
  {
    path: "donaciones/lista",
    loadComponent: () => import('./features/donations/components/donation-list/donation-list.component').then(c => c.DonationListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.TRANSACTION]}
  },
  //Facturas
  {
    path: "facturas",
    loadComponent: () => import('./features/invoice/components/invoice-list/invoice-list.component').then(c => c.InvoiceListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER]}
  },
  //Links del home
  {
    path: "transparencia",
    loadChildren: () => Transparencia
  },
  {
    path: "calidad",
    loadComponent: () => import('./web-pages/calidad/calidad.component').then(c => c.CalidadComponent),
  },
  {
    path: "igualdad",
    loadComponent: () => import('./web-pages/igualdad/igualdad.component').then(c => c.IgualdadComponent),
  },
  {
    path: "canal-de-denuncias",
    loadComponent: () => import('./features/comunica/components/canal-denuncias/canal-denuncias.component').then(c => c.CanalDenunciasComponent),
  },
  {
    path: "contacto",
    loadComponent: () => import('./features/comunica/components/contacto/contacto.component').then(c => c.ContactoComponent),
  },
  {
    path: "ser-scout",
    loadComponent: () => import('./features/scout-forms/components/ser-scout-control/ser-scout-control.component').then(c => c.SerScoutControlComponent),
  },
  {
    path: "ser-scouter",
    loadComponent: () => import('./features/scouter-forms/components/ser-scouter/ser-scouter.component').then(c => c.SerScouterComponent),
  },
  {
    path: "donaciones",
    loadComponent: () => import('./features/donations/components/donation-menu/donation-menu.component').then(c => c.DonationMenuComponent),
  },
  {
    path: "donaciones/formulario",
    loadComponent: () => import('./features/donations/components/donation-form/donation-form.component').then(c => c.DonationFormComponent),
  },
  {
    path: "colaboraciones",
    loadComponent: () => import('./features/colaboraciones/colaboraciones.component').then(c => c.ColaboracionesComponent),
  },
  {
    path: "seccion-senior",
    loadComponent: () => import('./features/senior-section/components/senior-form/senior-form.component').then(c => c.SeniorFormComponent),
  },
  {
    path: "seccion-senior/lista",
    loadComponent: () => import('./features/senior-section/components/senior-form-list/senior-form-list.component').then(c => c.SeniorFormListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.FORM]}
  },
  //Jamboree
  {
    path: "jamboree/formulario",
    loadComponent: () => import('./features/jamboree/jamboree-form/jamboree-form.component').then(c => c.JamboreeFormComponent)
  },
  {
    path: "jamboree/inscripciones",
    loadComponent: () => import('./features/jamboree/jamboree-inscription-list/jamboree-inscription-list.component').then(c => c.JamboreeInscriptionListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.FORM]}
  },

  //Asociación Bentaya
  {
    path: "asociacion/grupo",
    loadComponent: () => AsociacionComponent
  },
  {
    path: "asociacion/secciones",
    loadComponent: () => UnidadesComponent
  },
  {
    path: "asociacion/historia",
    loadComponent: () => HistoriaComponent
  },
  {
    path: "asociacion/mision-vision-valores",
    loadComponent: () => MisionVisionValoresComponent
  },
  {
    path: "asociacion/reconocimientos",
    loadComponent: () => ReconocimientosComponent
  },
  //Centros Scout
  {
    path: "centros-scout",
    loadChildren: () => Booking
  },
  //Footer
  {
    path: "aviso-legal",
    loadComponent: () => import('./web-pages/aviso-legal/aviso-legal.component').then(c => c.AvisoLegalComponent),
  },
  {
    path: "condiciones-de-uso",
    loadComponent: () => import('./web-pages/condiciones-uso/condiciones-uso.component').then(c => c.CondicionesUsoComponent),
  },
  {
    path: "politica-privacidad",
    loadComponent: () => import('./web-pages/politica-privacidad/politica-privacidad.component').then(c => c.PoliticaPrivacidadComponent),
  },
  //Error
  {
    path: "**",
    redirectTo: () => inject(UserRoutesService).getUserHome(),
    pathMatch: "full"
  },
];

const Transparencia: Route[] = [
  {
    path: "",
    component: TransparenciaComponent
  },
  {
    path: "gestion-economica",
    component: GestionEconomicaComponent
  },
  {
    path: "cargos",
    component: CargosComponent
  }
];

const Booking: Route[] = [
  {
    path: '',
    redirectTo: "informacion",
    pathMatch: "full"
  },
  {
    path: "informacion",
    loadComponent: () => import('./features/booking/components/booking-home/booking-home.component').then(c => c.BookingHomeComponent)
  },
  {
    path: "reserva",
    loadComponent: () => import('./features/booking/components/booking-form/booking-form.component').then(c => c.BookingFormComponent)
  },
  {
    path: "grupo",
    loadComponent: () => import('./features/booking/components/own-booking/own-booking-list/own-booking-list.component').then(c => c.OwnBookingListComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER]},
  },
  {
    path: "grupo/:bookingId",
    loadComponent: () => import('./features/booking/components/own-booking/own-booking-follow-up/own-booking-follow-up.component').then(c => c.OwnBookingFollowUpComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUTER, UserRole.GROUP_SCOUTER]},
  },
  {
    path: "seguimiento",
    loadComponent: () => import('./features/booking/components/management/booking-management-menu/booking-management-menu.component').then(c => c.BookingManagementMenuComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUT_CENTER_REQUESTER], isManager: false},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pendientes'
      },
      {
        path: 'pendientes',
        component: PendingBookingsComponent
      },
      {
        path: 'calendario',
        component: BookingManagementCalendarComponent
      },
      {
        path: 'lista',
        component: BookingListComponent
      }
    ]
  },
  {
    path: "seguimiento/reserva/:bookingId",
    loadComponent: () => import('./features/booking/components/booking-follow-up/booking-follow-up.component').then(c => c.BookingFollowUpComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUT_CENTER_REQUESTER]}
  },
  {
    path: "gestion",
    loadComponent: () => import('./features/booking/components/management/booking-management-menu/booking-management-menu.component').then(c => c.BookingManagementMenuComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUT_CENTER_MANAGER], isManager: true},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pendientes'
      },
      {
        path: 'pendientes',
        component: PendingBookingsComponent
      },
      {
        path: 'calendario',
        component: BookingManagementCalendarComponent
      },
      {
        path: 'lista',
        component: BookingListComponent
      }
    ]
  },
  {
    path: "gestion/reserva/:bookingId",
    loadComponent: () => import('./features/booking/components/management/booking-detail-control/booking-detail-control.component').then(c => c.BookingDetailControlComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUT_CENTER_MANAGER]}
  },
  {
    path: "datos",
    loadComponent: () => import('./features/scout-center/components/scout-center-management/scout-center-management.component').then(c => c.ScoutCenterManagementComponent),
    canActivate: [authGuard],
    data: {roles: [UserRole.SCOUT_CENTER_MANAGER]}
  }
];

