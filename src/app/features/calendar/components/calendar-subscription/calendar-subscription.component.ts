import {Component, inject} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {environment} from "../../../../../environments/environment";
import {EventService} from "../../services/event.service";
import {map} from "rxjs";

@Component({
  selector: 'app-calendar-subscription',
  standalone: true,
  imports: [
    ButtonDirective
  ],
  templateUrl: './calendar-subscription.component.html',
  styleUrl: './calendar-subscription.component.scss'
})
export class CalendarSubscriptionComponent {

  protected copied = false;
  private url = environment.apiUrl;
  private event = inject(EventService);

  protected openAppleLink() {
    this.getCalendarToken().subscribe({
      next: link => window.open(`webcal${link.substring(link.indexOf(":"))}`)
    });
  }

  protected copyLink() {
    this.copied = true;
    this.getCalendarToken().subscribe({
      next: link => navigator.clipboard.writeText(link).then(() => this.reactivateCopyButton())
    });
  }

  protected reactivateCopyButton() {
    setTimeout(() => this.copied = false, 6000);
  }

  private getCalendarToken() {
    return this.event.subscribeToCalendar().pipe(
      map(token => `${this.url}/event/public/calendar?token=${token}`)
    );
  }
}
