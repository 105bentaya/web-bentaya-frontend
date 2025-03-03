import {Component, inject, OnInit} from '@angular/core';
import {SettingsService} from "../../../settings/settings.service";
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ClosedSerScoutComponent} from '../closed-ser-scout/closed-ser-scout.component';
import {SerScoutComponent} from '../ser-scout/ser-scout.component';

@Component({
  selector: 'app-ser-scout-control',
  templateUrl: './ser-scout-control.component.html',
  styleUrls: ['./ser-scout-control.component.scss'],
  imports: [
    SerScoutComponent,
    ClosedSerScoutComponent,
    ProgressSpinnerModule
  ]
})
export class SerScoutControlComponent implements OnInit {

  private readonly settingsService = inject(SettingsService);

  protected formLoading = true;
  protected yearLoading = true;
  protected showForm = false;
  protected formYear = 2023;
  protected error = false;

  ngOnInit(): void {
    this.settingsService.getByName("formIsOpen").subscribe({
      next: setting => {
        this.showForm = setting.value === "1";
        this.formLoading = false;
      },
      error: () => {
        this.error = true;
        this.formLoading = false;
        this.yearLoading = false;
      }
    });
    this.settingsService.getByName("currentFormYear").subscribe({
      next: setting => {
        this.formYear = +setting.value;
        this.yearLoading = false;
      },
      error: () => {
        this.error = true;
        this.yearLoading = false;
        this.formLoading = false;
      }
    });
  }
}
