import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Button, ButtonIcon} from "primeng/button";
import {NgClass} from "@angular/common";
import {UserMenuService} from "./user-menu.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/services/auth.service";
import {Divider} from "primeng/divider";
import {buildSplitMenu} from "./user-menu.helper";
import {LoggedUserDataService} from "../auth/services/logged-user-data.service";
import {WindowUtils} from "../../shared/util/window-utils";
import {Tooltip} from "primeng/tooltip";
import {filter} from "rxjs";
import {NotificationService} from "../notification/notification.service";
import {OverlayBadge} from "primeng/overlaybadge";

@Component({
  selector: 'app-user-menu',
  imports: [
    Button,
    NgClass,
    ButtonIcon,
    RouterLink,
    Divider,
    Tooltip,
    OverlayBadge
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {

  private readonly userMenuService = inject(UserMenuService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly loggedUserData = inject(LoggedUserDataService);
  private readonly router = inject(Router);

  protected animate = false;
  protected expanded: boolean = this.userMenuService.currentExpanded;
  protected showMask!: boolean;
  protected items: any[] = [];

  constructor() {
    this.checkMaskNeed();
    this.userMenuService.expanded
      .pipe(takeUntilDestroyed())
      .subscribe(expanded => {
        this.expanded = expanded;
        this.checkMaskNeed();
      });

    this.router.events.pipe(
      takeUntilDestroyed(),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(e => this.checkForSelection(e.url));

    this.notificationService.userHasNotifications$
      .pipe(takeUntilDestroyed())
      .subscribe(hasNotifications => {
        const menu = this.items.find(i => i.label === "Asistencia");
        if (menu) menu.checked = hasNotifications;
      });
  }

  ngOnInit() {
    this.items = buildSplitMenu(this.loggedUserData);
    this.checkForSelection(this.router.url);
    this.notificationService.checkIfHasNotifications()

  }

  private checkForSelection(url: string) {
    this.items.filter(i => i.selected).forEach(i => i.selected = false);
    const item = this.items.find(item => item.route && url.startsWith(item.route));
    if (item) item.selected = true;
  }

  protected resizeMenu() {
    this.animate = true;
    this.userMenuService.invertExpanded();
  }

  protected logOut() {
    this.authService.logout();
  }

  protected closeMenu() {
    if (this.expanded && WindowUtils.windowSmallerLG()) {
      this.userMenuService.invertExpanded();
    }
  }

  @HostListener('window:resize')
  protected onResize() {
    this.checkMaskNeed();
  }

  private checkMaskNeed() {
    this.showMask = this.expanded && WindowUtils.windowSmallerLG();
  }

  protected get bigMenu(): boolean {
    return !WindowUtils.windowSmallerLG();
  }

  protected get smallMenu(): boolean {
    return !WindowUtils.windowSmallerSM() && WindowUtils.windowSmallerLG();
  }
}
