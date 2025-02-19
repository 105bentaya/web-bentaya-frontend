import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AuthService} from '../auth/services/auth.service';
import {NotificationService} from "../notification/notification.service";
import {Button} from 'primeng/button';
import {BadgeModule} from "primeng/badge";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.scss'],
  providers: [DialogService],
  standalone: true,
  imports: [
    RouterLink,
    BadgeModule,
    Button,
    SidebarComponent
  ]
})
export class HomeBarComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  protected hasNotifications = false;
  protected loginDisabled = true;

  ngOnInit() {
    this.loginDisabled = false;
    this.watchUserAttendanceNotifications();
  }

  private watchUserAttendanceNotifications() {
    if (this.authService.isLoggedIn()) this.notificationService.checkIfHasNotifications();
    this.notificationService.userHasNotifications$.subscribe(hasNotifications => {
      this.hasNotifications = hasNotifications;
    });
  }
}
