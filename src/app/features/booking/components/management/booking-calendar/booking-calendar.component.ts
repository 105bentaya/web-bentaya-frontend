import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CalendarOptions, EventClickArg} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import {Status} from "../../../constant/status.constant";
import {BookingCalendarInfo} from "../../../model/booking-calendar-info.model";
import {FullCalendarModule} from '@fullcalendar/angular';

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.scss'],
  imports: [FullCalendarModule]
})
export class BookingCalendarComponent implements OnChanges {

  @Input() dateRanges: BookingCalendarInfo[] = [];
  @Input() currentReservationId: number | undefined;
  @Input() calendarDate!: Date;
  @Input() loading = false;
  @Output() changeId = new EventEmitter<number>();

  protected options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    height: "auto",
    locale: "es-ES",
    firstDay: 1,
    buttonText: {
      today: 'Hoy'
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit'
    },
    eventOrder: 'priority',
    eventClick: (e) => this.onEventClick(e)
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateRanges'] && this.dateRanges) {
      this.options.events = this.dateRanges.map(dateRange => this.createEvent(dateRange));
    }
    if (changes['calendarDate']) {
      this.options.initialDate = this.calendarDate;
    }
  }

  private createEvent(dateRange: BookingCalendarInfo): any {
    const endDate = new Date(dateRange.endDate);
    endDate.setDate(endDate.getDate() + 1);
    return {
      start: new Date(dateRange.startDate),
      end: endDate,
      allDay: true,
      id: dateRange.id,
      ...this.getEventStyle(dateRange)
    };
  }

  private getEventStyle(calendarInfo: BookingCalendarInfo) {
    return {
      title: `${calendarInfo.packs} packs - ${this.getStatusName(calendarInfo)} - Nº ${calendarInfo.id}`,
      class: 'fs-4',
      color: this.getStatusBackground(calendarInfo),
      priority: this.getStatusPriority(calendarInfo)
    };
  }

  getStatusName(calendarInfo: BookingCalendarInfo) {
    if (calendarInfo.id === this.currentReservationId) return "Actual";
    switch (calendarInfo.status) {
      case Status.NEW:
        return "Nueva";
      case Status.RESERVED:
        return "A la espera";
      case Status.OCCUPIED:
        return calendarInfo.fullyOccupied ? "Totalmente Ocupada" : "Parcialmente Ocupada";
      case Status.CANCELED:
        return "Cancelada";
      case Status.REJECTED:
        return "Rechazada";
    }
  }

  private getStatusBackground(calendarInfo: BookingCalendarInfo) {
    if (calendarInfo.id === this.currentReservationId) return "var(--p-purple-500)";
    switch (calendarInfo.status) {
      case Status.NEW:
        return `var(--p-blue-500)`;
      case Status.RESERVED:
        return `var(--p-orange-500)`;
      case Status.OCCUPIED:
        return calendarInfo.fullyOccupied ? `var(--p-green-700)` : `var(--p-green-500)`;
      case Status.CANCELED:
      case Status.REJECTED:
        return `var(--p-red-500)`;
    }
  }

  private getStatusPriority(calendarInfo: BookingCalendarInfo) {
    if (calendarInfo.status == Status.OCCUPIED && calendarInfo.fullyOccupied) return 10;
    switch (calendarInfo.status) {
      case Status.OCCUPIED:
        return 20;
      case Status.RESERVED:
        return 30;
      case Status.NEW:
        return 40;
      case Status.CANCELED:
        return 50;
      case Status.REJECTED:
        return 60;
      default:
        return 100;
    }
  }

  private onEventClick(e: EventClickArg) {
    if (+e.event.id !== this.currentReservationId) {
      this.changeId.emit(+e.event.id);
    }
  }
}
