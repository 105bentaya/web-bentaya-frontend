import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {EventFormComponent} from "../event-form/event-form.component";
import {EventService} from "../../services/event.service";
import {EventInfoComponent} from "../event-info/event-info.component";
import {FullCalendarComponent, FullCalendarModule} from "@fullcalendar/angular";
import {BasicEvent} from "../../models/basic-event.model";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {LoggedUserInformationService} from "../../../../core/auth/services/logged-user-information.service";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ActivatedRoute} from "@angular/router";
import {groups, unitGroups} from "../../../../shared/model/group.model";
import {User} from "../../../users/models/user.model";
import {EventStatusService} from "../../services/event-status.service";
import {Subscription} from "rxjs";
import {ScoutEvent} from "../../models/scout-event.model";
import {DatePipe, NgClass, NgTemplateOutlet} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {ButtonGroupModule} from "primeng/buttongroup";
import {SentenceCasePipe} from "../../../../shared/pipes/sentence-case.pipe";
import {SelectButtonModule} from "primeng/selectbutton";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {DateUtils} from "../../../../shared/util/date-utils";
import {FormEvent} from "../../models/form-event.model";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    NgClass,
    ButtonDirective,
    ButtonGroupModule,
    DatePipe,
    SentenceCasePipe,
    FullCalendarModule,
    SelectButtonModule,
    MultiSelectModule,
    FormsModule,
    NgTemplateOutlet
  ]
})
export class CalendarComponent implements OnInit, OnDestroy {

  protected options: CalendarOptions;
  protected ref!: DynamicDialogRef;

  protected events!: BasicEvent[];

  protected calendarDate: Date;
  protected calendarView: boolean = true;

  protected viewOptions: any[];
  protected currentView: string = "dayGridMonth";

  protected canEdit: boolean = false;

  protected groups = [...unitGroups, groups[0]];
  protected filterResults!: number[];
  private loggedUser: User;

  protected loading = true;

  private newEventSubscription: Subscription;
  private updatedEventSubscription: Subscription;
  private deletedEventSubscription: Subscription;

  @ViewChild('top')
  private topOfList!: ElementRef;
  @ViewChild('calendarComponent')
  private calendarComponent!: FullCalendarComponent;

  isAdmin = false;

  constructor(
    private dialogService: DialogService,
    private eventService: EventService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private eventStatusService: EventStatusService
  ) {
    this.loggedUser = LoggedUserInformationService.getUserInformation();
    this.isAdmin = this.authService.hasRequiredPermission(["ROLE_ADMIN"]);
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
    this.canEdit = this.authService.hasRequiredPermission(["ROLE_ADMIN", "ROLE_SCOUTER", "ROLE_GROUP_SCOUTER"]);

    this.deletedEventSubscription = this.eventStatusService.deletedEvent.subscribe(id => this.onEventDelete(id));
    this.updatedEventSubscription = this.eventStatusService.updatedEvent.subscribe(event => this.onEventUpdate(event));
    this.newEventSubscription = this.eventStatusService.newEvent.subscribe(event => this.onEventAdd(event));
  }

  ngOnInit(): void {
    this.buildFilter();
    this.getAllEvents();
    if (window.innerWidth < 450) {
      this.currentView = "customList";
      this.options.initialView = "customList";
      this.calendarView = false;
    }
  }

  ngOnDestroy() {
    this.deletedEventSubscription.unsubscribe();
    this.updatedEventSubscription.unsubscribe();
    this.newEventSubscription.unsubscribe();
  }

  private buildFilter() {
    const filter = new Set<number>;
    filter.add(0);

    if (this.canEdit) {
      filter.add(8);
      this.groups.push(groups[8]);
    }

    if (this.loggedUser.groupId) filter.add(this.loggedUser.groupId);
    if (this.loggedUser.scoutList) this.loggedUser.scoutList.forEach(scout => filter.add(scout.groupId));

    this.filterResults = [...filter];
  }

  private getAllEvents() {
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.events = events.sort((e1, e2) => {
          return e1.groupId - e2.groupId;
        });
        this.pushEventsToCalendar();
        this.checkQueryParams();
      }, error: () => {
        this.alertService.sendBasicErrorMessage("Error al cargar las actividades");
        this.loading = false;
      }
    });
  }

  protected pushEventsToCalendar() {
    this.loading = true;
    this.options.events = this.events
      .filter(e => this.filterResults.includes(e.groupId))
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
      start: this.getEventDate(basicEvent.startDate, basicEvent.unknownTime),
      end: this.getEventDate(basicEvent.endDate, basicEvent.unknownTime),
      color: this.getEventColor(basicEvent.groupId),
      extendedProps: basicEvent,
      className: eventClasses.join(" ")
    };
  }

  getEventDate(date: Date, unknownTime: boolean) {
    return unknownTime ?
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
    this.ref = this.dialogService.open(EventInfoComponent, {
      header: 'Actividad',
      styleClass: 'small dialog-width',
      data: eventId
    });
  }

  protected openAddDialog() {
    this.ref = this.dialogService.open(EventFormComponent, {
      header: 'Añadir Actividad',
      styleClass: 'dialog-width',
      data: {calendarDate: this.calendarDate}
    });
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
    if (!this.calendarView && window.innerWidth < 576) this.topOfList.nativeElement.scrollIntoView();
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['eventId']) this.openInfoDialog(params['eventId']);
    });
  }

  private onEventDelete(eventId: number) {
    this.events.splice(this.events.findIndex(event => event.id === eventId), 1);
    this.pushEventsToCalendar();
  }

  private onEventAdd(event: ScoutEvent) {
    this.events.push(event);
    this.pushEventsToCalendar();
    this.openInfoDialog(event.id);
  }

  private onEventUpdate(updatedEvent: ScoutEvent) {
    this.events.splice(this.events.findIndex(event => event.id === updatedEvent.id), 1);
    this.events.push(updatedEvent);
    this.pushEventsToCalendar();
  }

  protected subscribeToCalendar() {
    this.eventService.subscribeToCalendar().subscribe({
      next: res => {
        console.log(`webcal://105bentaya.org/api/event/public/calendar?token=${res}`);
      },
      error: () => this.alertService.sendBasicErrorMessage("error")
    });
  }
}
