import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CalendarOptions, EventClickArg} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import {Status} from "../../constant/status.constant";
import {BookingDate} from "../../model/booking-date.model";
import {FullCalendarModule} from '@fullcalendar/angular';

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.scss'],
  imports: [FullCalendarModule]
})
export class BookingCalendarComponent implements OnChanges {

  protected options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    height: "auto",
    locale: "es-ES",
    firstDay: 1,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit'
    },
    eventOrder: 'priority',
    eventClick: (e) => this.onEventClick(e)
  };

  @Input() dateRanges: BookingDate[] = [];
  @Input() currentReservationId!: number;
  @Input() enableEventClick: boolean = true;
  @Input() calendarDate!: Date;
  @Output() changeId = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateRanges'] && this.dateRanges) {
      this.options.events = this.dateRanges.map(dateRange => this.createEvent(dateRange));
    }
    if (changes['calendarDate']) {
      this.options.initialDate = this.calendarDate;
    }
  }

  private createEvent(dateRange: BookingDate): any {
    const endDate = new Date(dateRange.endDate);
    endDate.setDate(endDate.getDate() + 1);
    return {
      start: new Date(dateRange.startDate),
      end: endDate,
      allDay: true,
      id: dateRange.id,
      ...this.getEventStyle(dateRange.status, dateRange.id, dateRange.packs)
    };
  }

  private getEventStyle(status: Status, id: number, packs: number) {
    let title = `${packs} packs - `;
    let color;

    if (id === this.currentReservationId) {
      title += "Actual";
      color = '#2b50e5';
    } else if (status === "FULLY_OCCUPIED") {
      title += "Totalmente Ocupada";
      color = '#c50909';
    } else if (status === "OCCUPIED") {
      title += "Parcialmente Ocupada";
      color = '#fa9f13';
    } else if (status === "RESERVED") {
      title += "A la espera";
      color = '#e8dd08';
    } else if (status === "NEW") {
      title += "Nueva";
      color = '#05cc6f';
    } else if (status === "LEFT") {
      title += "Esperando Revisión";
      color = '#c47d06';
    } else if (status === "FINISHED") {
      title += "Reserva Finalizada";
      color = '#00b9fb';
    } else if (status === "CANCELED" || status == "REJECTED") {
      title += status === "CANCELED" ? "Cancelada" : 'Rechazada';
      color = '#c4064f';
    } else {
      title += status;
      color = '#3d2d54';
    }

    title += ` - Nº ${id}`;

    return {title, color, priority: this.getStatusPriority(status)};
  }

  private getStatusPriority(status: Status) {
    if (status === "FULLY_OCCUPIED") {
      return 10;
    } else if (status === "OCCUPIED") {
      return 20;
    } else if (status === "RESERVED") {
      return 30;
    } else if (status === "NEW") {
      return 40;
    } else if (status === "LEFT") {
      return 50;
    } else if (status === "FINISHED") {
      return 60;
    } else if (status === "CANCELED") {
      return 70;
    } else if (status === "REJECTED") {
      return 80;
    } else {
      return 100;
    }
  }

  private onEventClick(e: EventClickArg) {
    if (this.enableEventClick && +e.event.id !== this.currentReservationId) {
      this.changeId.emit(+e.event.id);
    }
  }
}
