import {LoggedUserDataService} from "../auth/services/logged-user-data.service";
import {MenuItem} from "primeng/api";
import {UserRole} from "../../features/users/models/role.model";

const calendar = {label: "Calendario", icon: "pi pi-calendar", route: "/calendario"};
const userScoutData = {label: "Datos", icon: "pi pi-id-card", route: "/datos"};
const userAttendanceList = {label: 'Asistencia', icon: "pi pi-check-circle", route: "/asistencias"};
const groupScoutList = {label: "Educandas", icon: "pi pi-users", route: "/unidad/educandas", category: "Unidad"};
const groupAttendanceList = {label: "Listas de Asistencia", icon: "pi pi-list-check", route: "/unidad/asistencias", category: "Unidad"};
const groupInscriptions = {label: "Preinscripciones", icon: "pi pi-folder", route: "/unidad/preinscripciones", category: "Unidad"};
const invoiceList = {label: "Facturas", icon: "pi pi-receipt", route: "/facturas", category: "Gestión de Grupo"};
const generalScoutList = {label: "Educandas", icon: "pi pi-users", route: "/unidad/educandas", category: "Gestión de Grupo"};
const groupBookings = {label: "Centros Scout", icon: "fa-solid fa-tents", route: "/centros-scout/grupo", category: "Gestión de Grupo"};
const scoutCenterRequester = {label: "Mis Reservas", icon: "pi pi-compass", route: "/centros-scout/seguimiento"};
const scoutCenterManager = {label: "Gestión de Reservas", icon: "fa-solid fa-tents", route: "/centros-scout/gestion", category: "Centros Scout"};
const scoutCenterInformation = {label: "Ajustes Centros Scout", icon: "fa-solid fa-sliders", route: "/centros-scout/datos", category: "Centros Scout"};
const donations = {label: "Donaciones", icon: "fa-solid fa-piggy-bank", route: '/donaciones/lista', category: "Gestión de Grupo"};
const inscriptions = {label: "Preinscripciones", icon: "pi pi-folder", route: "/preinscripciones", category: "Gestión de Grupo"};
const volunteers = {label: "Voluntariado", icon: "pi pi-heart", route: "/voluntariado", category: "Gestión de Grupo"};
const senior = {label: "Sección Sénior", icon: "fa-solid fa-hat-cowboy", route: "/seccion-senior/lista", category: "Gestión de Grupo"};
const userList = {label: "Usuarios", icon: "pi pi-database", route: "/usuarios", category: "Administración"};
const scoutList = {label: "Educandas", icon: "pi pi-server", route: "/educandas", category: "Administración"};
const settings = {label: "Ajustes", icon: "pi pi-cog", route: "/ajustes", category: "Administración"};

export function buildSplitMenu(user: LoggedUserDataService): MenuItem[] {
  const menuItems = [];

  if (userIsScoutMember(user)) {
    menuItems.push(calendar);
  }
  if (user.hasRequiredPermission(UserRole.USER)) {
    menuItems.push(userScoutData, userAttendanceList);
  }
  if (user.hasRequiredPermission(UserRole.SCOUTER)) {
    menuItems.push(groupScoutList, groupAttendanceList, groupInscriptions, invoiceList);
  }
  if (user.hasRequiredPermission(UserRole.SCOUT_CENTER_REQUESTER)) {
    menuItems.push(scoutCenterRequester);
  }
  if (user.hasRequiredPermission(UserRole.SCOUT_CENTER_MANAGER)) {
    menuItems.push(scoutCenterManager, scoutCenterInformation);
  }
  if (user.hasRequiredPermission(UserRole.GROUP_SCOUTER)) {
    menuItems.push(generalScoutList, invoiceList);
  }
  if (user.hasRequiredPermission(UserRole.GROUP_SCOUTER, UserRole.SCOUTER) && !user.hasRequiredPermission(UserRole.SCOUT_CENTER_MANAGER)) {
    menuItems.push(groupBookings);
  }
  if (user.hasRequiredPermission(UserRole.TRANSACTION)) {
    menuItems.push(/*transactions, */donations);
  }
  if (user.hasRequiredPermission(UserRole.FORM)) {
    menuItems.push(inscriptions, volunteers, senior);
  }
  if (user.hasRequiredPermission(UserRole.ADMIN)) {
    menuItems.push(userList, scoutList, settings);
  }

  return filter([...new Set(menuItems)]);
}

function filter(menuItems: any[]) {
  if (menuItems.length < 5) return menuItems;

  let newItems: any[] = [];
  [...new Set(menuItems.map(item => item.category))].forEach(category => {
    const categoryItems = menuItems.filter(item => item.category === category);
    if (category === undefined) {
      newItems = categoryItems.concat(newItems);
    } else {
      newItems.push({divider: category});
      newItems = newItems.concat(categoryItems);
    }
  });
  return newItems;
}

function userIsScoutMember(user: LoggedUserDataService): boolean {
  return user.hasRequiredPermission(UserRole.USER, UserRole.SCOUTER, UserRole.GROUP_SCOUTER);
}
