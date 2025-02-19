import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {environment} from "../../../../../environments/environment";
import {EventService} from "../../services/event.service";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-calendar-subscription',
  imports: [
    DialogModule,
    Button
  ],
  templateUrl: './calendar-subscription.component.html',
  styleUrl: './calendar-subscription.component.scss'
})
export class CalendarSubscriptionComponent implements OnInit {

  private readonly eventService = inject(EventService);
  private readonly url = environment.apiUrl;
  protected copied = false;
  protected showInfo = false;
  private link!: string;

  ngOnInit() {
    this.getCalendarToken();
  }

  protected openAppleLink() {
    window.open(`webcal${this.link.substring(this.link.indexOf(":"))}`, "_blank");
  }

  protected copyLink() {
    this.copied = true;
    navigator.clipboard.writeText(this.link).then(() => this.reactivateCopyButton());
  }

  protected reactivateCopyButton() {
    setTimeout(() => this.copied = false, 6000);
  }

  private getCalendarToken() {
    this.eventService.subscribeToCalendar().subscribe({
      next: token => this.link = `${this.url}/event/public/calendar?token=${token}`
    });
  }
}
