import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AuthService} from '../auth/services/auth.service';
import {NotificationService} from "../notification/notification.service";
import {BadgeModule} from "primeng/badge";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {GeneralAButtonComponent} from "../../shared/components/buttons/general-a-button/general-a-button.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.scss'],
  providers: [DialogService],
  imports: [
    RouterLink,
    BadgeModule,
    SidebarComponent,
    GeneralAButtonComponent,
    NgClass
  ]
})
export class HomeBarComponent implements OnInit {
  @Input() isProtectedRoute: boolean | undefined;
  @Input() isLogin: boolean | undefined;
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
