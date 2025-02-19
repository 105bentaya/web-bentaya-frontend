import {Route, Routes} from '@angular/router';
import {TransparenciaComponent} from "./web-pages/transparencia/transparencia.component";
import {
  GestionEconomicaComponent
} from "./web-pages/transparencia/components/gestion-economica/gestion-economica.component";
import {CargosComponent} from "./web-pages/transparencia/components/cargos/cargos.component";
import {AsociacionComponent} from "./web-pages/asociacion/asociacion.component";
import {authGuard} from "./core/auth/guards/auth.guard";
import {noAuthGuard} from "./core/auth/guards/no-auth.guard";

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
  // {
  //   path: "mi-vivac",
  //   loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
  // },
  {
    path: "calendario",
    loadComponent: () => import('./features/calendar/components/calendar/calendar.component').then(c => c.CalendarComponent),
    canActivate: [authGuard]
  },
  {
    path: "login",
    loadComponent: () => import('./features/login/components/login/login.component').then(c => c.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: "olvide-la-clave",
    loadComponent: () => import('./features/login/components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
    canActivate: [noAuthGuard]
  },
  //todo: merge with change-password
  {
    path: "restablecer-clave/:token",
    loadComponent: () => import('./features/login/components/reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
  },
  //ADMIN
  {
    path: "ajustes",
    loadComponent: () => import('./core/settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_ADMIN"]}
  },
  {
    path: "usuarios",
    loadComponent: () => import('./features/users/components/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_ADMIN"]}
  },
  {
    path: "usuarios/:userId",
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_ADMIN"]}
  },
  {
    path: "usuarios/new",
    loadComponent: () => import('./features/users/components/user-form/user-form.component').then(c => c.UserFormComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_ADMIN"]}
  },
  {
    path: "preinscripciones",
    loadComponent: () => import('./features/scout-forms/components/ser-scout-table/ser-scout-table.component').then(c => c.SerScoutTableComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_FORM"]}
  },
  {
    path: "preinscripciones-scouters",
    loadComponent: () => import('./features/scout-forms/components/ser-scouter-table/ser-scouter-table.component').then(c => c.SerScouterTableComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_FORM"]}
  },
  {
    path: "educandas",
    loadComponent: () => import('./features/scouts/components/scout-list/scout-list.component').then(c => c.ScoutListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_ADMIN"]}
  },
  //Unidad
  {
    path: "unidad/educandas",
    loadComponent: () => import('./features/scouts/components/group-scout-list/group-scout-list.component').then(c => c.GroupScoutListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUTER", "ROLE_GROUP_SCOUTER"]}
  },
  {
    path: "unidad/asistencias",
    loadComponent: () => import('./features/attendance/components/scouter-attendance-list/scouter-attendance-list.component').then(c => c.ScouterAttendanceListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUTER"]}
  },
  {
    path: "unidad/preinscripciones",
    loadComponent: () => import('./features/scout-forms/components/group-ser-scout-table/group-ser-scout-table.component').then(c => c.GroupSerScoutTableComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUTER"]}
  },
  //Usuario
  {
    path: "asistencias",
    loadComponent: () => import('./features/attendance/components/user-attendance-list/user-attendance-list.component').then(c => c.UserAttendanceListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_USER"]}
  },
  //Donaciones
  {
    path: "donaciones/lista",
    loadComponent: () => import('./features/donations/components/donation-list/donation-list.component').then(c => c.DonationListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_TRANSACTION"]}
  },
  //Facturas
  {
    path: "facturas",
    loadComponent: () => import('./features/invoice/components/invoice-list/invoice-list.component').then(c => c.InvoiceListComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUTER", "ROLE_GROUP_SCOUTER"]}
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
    loadComponent: () => import('./features/scout-forms/components/ser-scouter/ser-scouter.component').then(c => c.SerScouterComponent),
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
    data: {roles: ["ROLE_FORM"]}
  },
  //Asociación Bentaya
  {
    path: "asociacion",
    loadComponent: () => AsociacionComponent
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
    redirectTo: "inicio",
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
    loadComponent: () => import('./features/booking/components/booking-menu/booking-menu.component').then(c => c.BookingMenuComponent)
  },
  {
    path: "reserva",
    loadComponent: () => import('./features/booking/components/booking-form/booking-form.component').then(c => c.BookingFormComponent)
  },
  {
    path: "seguimiento",
    loadComponent: () => import('./features/booking/components/booking-follow-up/booking-follow-up.component').then(c => c.BookingFollowUpComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUT_CENTER_REQUESTER"]}
  },
  {
    path: "gestion",
    loadComponent: () => import('./features/booking/components/booking-management/booking-management.component').then(c => c.BookingManagementComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUT_CENTER_MANAGER"]}
  },
  {
    path: "gestion/:bookingId",
    loadComponent: () => import('./features/booking/components/booking-detail-control/booking-detail-control.component').then(c => c.BookingDetailControlComponent),
    canActivate: [authGuard],
    data: {roles: ["ROLE_SCOUT_CENTER_MANAGER"]}
  }
];

