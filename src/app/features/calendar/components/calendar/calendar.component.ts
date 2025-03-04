import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {DialogService} from "primeng/dynamicdialog";
import {EventFormComponent} from "../event-form/event-form.component";
import {EventService} from "../../services/event.service";
import {EventInfoComponent} from "../event-info/event-info.component";
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {BasicEvent} from "../../models/basic-event.model";
import {ActivatedRoute, Router} from "@angular/router";
import {EventStatusService} from "../../services/event-status.service";
import {delay, skip} from "rxjs";
import {EventInfo} from "../../models/event-info.model";
import {DatePipe} from "@angular/common";
import {Button, ButtonDirective, ButtonIcon} from "primeng/button";
import {ButtonGroupModule} from "primeng/buttongroup";
import {SentenceCasePipe} from "../../../../shared/pipes/sentence-case.pipe";
import {SelectButtonModule} from "primeng/selectbutton";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {DateUtils} from "../../../../shared/util/date-utils";
import {CalendarSubscriptionComponent} from "../calendar-subscription/calendar-subscription.component";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserMenuService} from "../../../../core/user-menu/user-menu.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ToggleButton} from "primeng/togglebutton";
import {DynamicDialogService} from "../../../../shared/services/dynamic-dialog.service";
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DialogService, DynamicDialogService],
  imports: [
    ButtonGroupModule,
    DatePipe,
    SentenceCasePipe,
    FullCalendarModule,
    SelectButtonModule,
    MultiSelectModule,
    FormsModule,
    Button,
    ToggleButton,
    ButtonDirective,
    ButtonIcon,
    ProgressSpinner
  ]
})
export class CalendarComponent implements OnInit {

  private readonly dialogService = inject(DynamicDialogService);
  private readonly eventService = inject(EventService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventStatusService = inject(EventStatusService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly userMenuService = inject(UserMenuService);

  protected options: CalendarOptions;
  protected events!: BasicEvent[];
  protected calendarDate: Date;
  protected calendarView: boolean = true;
  protected viewOptions: any[];
  protected currentView: string = "dayGridMonth";
  protected isScouter: boolean = false;
  protected loading = true;
  private readonly userGroups: number[];

  @ViewChild('calendarComponent') private readonly calendarComponent!: FullCalendarComponent;

  constructor(
  ) {
    this.options = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, listPlugin, interactionPlugin],
      height: "auto",
      locale: "es-ES",
      firstDay: 1,
      views: {
        customList: {
          type: 'list',
          buttonText: 'Lista',
          titleFormat: {},
          visibleRange: {
            start: new Date(),
            end: '2099-01-01'
          },
          noEventsText: 'No se han encontrado futuras actividades para las unidades especificadas',
          allDayText: 'Todo el día',
          listDayFormat: {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }
        }
      },
      headerToolbar: {
        left: '',
        center: '',
        right: ''
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit'
      },
      eventClick: (info) => {
        this.openInfoDialog(+info.event.id);
      }
    };

    this.calendarDate = new Date();
    this.viewOptions = [{value: 'dayGridMonth', icon: 'pi pi-calendar'}, {value: 'customList', icon: 'pi pi-list'}];
    this.isScouter = this.loggedUserData.hasRequiredPermission(["ROLE_SCOUTER", "ROLE_GROUP_SCOUTER"]);

    this.eventStatusService.deletedEvent
      .pipe(takeUntilDestroyed())
      .subscribe(id => this.onEventDelete(id));
    this.eventStatusService.updatedEvent
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.onEventUpdate(event));
    this.eventStatusService.newEvent
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.onEventAdd(event));
    this.userMenuService.expanded
      .pipe(takeUntilDestroyed(), skip(1), delay(400))
      .subscribe(() => this.calendarComponent.getApi().render());

    this.userGroups = this.buildFilter();
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  private buildFilter() {
    const filter = new Set<number>;
    filter.add(0);

    if (this.isScouter) {
      filter.add(8);
    }

    const loggedUserGroupId = this.loggedUserData.getGroupId();
    if (loggedUserGroupId) filter.add(loggedUserGroupId);
    this.loggedUserData.getScoutGroupIds().forEach(groupId => filter.add(groupId));

    return [...filter];
  }

  private getAllEvents() {
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.events = events.sort((e1, e2) => {
          return e1.groupId - e2.groupId;
        });
        this.pushEventsToCalendar();
        this.checkQueryParams();
      }, error: () => this.loading = false
    });
  }

  protected pushEventsToCalendar(showAll = false) {
    this.loading = true;
    this.options.events = this.events
      .filter(e => showAll || this.userGroups.includes(e.groupId))
      .map(basicEvent => (this.generateEventObject(basicEvent)));
    this.loading = false;
  }

  private generateEventObject(basicEvent: BasicEvent) {
    const eventClasses = [];
    if (basicEvent.unknownTime) {
      eventClasses.push("unknown-time");
    }
    if (basicEvent.groupId == 2 || basicEvent.groupId == 3) {
      eventClasses.push("event-text-dark");
    }
    return {
      id: basicEvent.id.toString(),
      title: basicEvent.title,
      start: this.getEventDate(basicEvent.startDate, basicEvent),
      end: this.getEventDate(basicEvent.endDate, basicEvent),
      color: this.getEventColor(basicEvent.groupId),
      extendedProps: basicEvent,
      className: eventClasses.join(" ")
    };
  }

  protected getEventDate(date: Date, event: BasicEvent) {
    return event.unknownTime ?
      DateUtils.shiftDateToUTC(date) :
      new Date(date);
  }

  private getEventColor(groupId: number) {
    switch (groupId) {
      case 1:
        return "#52d8fb";
      case 2:
        return "#ffe446";
      case 3:
        return "#ffd400";
      case 4:
        return "#008f39";
      case 5:
        return "#59c830";
      case 6:
        return "#8a4c39";
      case 7:
        return "#e62a2d";
      case 8:
        return "#c279e8";
    }
    return "#622599";
  }

  private openInfoDialog(eventId: number) {
    return this.dialogService.openDialog(EventInfoComponent, "Actividad", "small", eventId);
  }

  protected openAddDialog() {
    this.dialogService.openDialog(EventFormComponent, "Añadir Actividad", "small", {calendarDate: this.calendarDate});
  }

  protected next() {
    this.calendarComponent.getApi().next();
    this.calendarDate = this.calendarComponent.getApi().getDate();
  }

  protected prev() {
    this.calendarComponent.getApi().prev();
    this.calendarDate = this.calendarComponent.getApi().getDate();
  }

  protected today() {
    this.calendarComponent.getApi().today();
    this.calendarDate = this.calendarComponent.getApi().getDate();
  }

  protected changeView() {
    this.calendarComponent.getApi().changeView(this.currentView);
    this.calendarView = this.currentView === "dayGridMonth";
    setTimeout(() => this.calendarComponent.getApi().updateSize(), 10);
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['actividad'];
      if (eventId) this.openInfoDialog(eventId).onClose.subscribe(() => this.router.navigate([], {replaceUrl: true}));
    });
  }

  private onEventDelete(eventId: number) {
    this.events.splice(this.events.findIndex(event => event.id === eventId), 1);
    this.pushEventsToCalendar();
  }

  private onEventAdd(event: EventInfo) {
    this.events.push(event);
    this.pushEventsToCalendar();
    this.openInfoDialog(event.id);
  }

  private onEventUpdate(updatedEvent: EventInfo) {
    this.events.splice(this.events.findIndex(event => event.id === updatedEvent.id), 1);
    this.events.push(updatedEvent);
    this.pushEventsToCalendar();
  }

  protected openSubscribeDialog() {
    this.dialogService.openDialog(CalendarSubscriptionComponent, "Suscribirse al Calendario", "small");
  }
}
