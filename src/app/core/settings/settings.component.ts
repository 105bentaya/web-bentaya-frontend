import {Component, inject, OnInit} from '@angular/core';
import {SettingsService} from "./settings.service";
import {Setting} from "./setting.model";
import {AlertService} from "../../shared/services/alert-service.service";
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {BasicLoadingInfoComponent} from "../../shared/components/basic-loading-info/basic-loading-info.component";
import {SaveButtonsComponent} from "../../shared/components/buttons/save-buttons/save-buttons.component";
import {DatePicker} from "primeng/datepicker";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    InputNumberModule,
    FormsModule,
    CheckboxModule,
    SaveButtonsComponent,
    BasicLoadingInfoComponent,
    DatePicker
  ]
})
export class SettingsComponent implements OnInit {

  private settingsService = inject(SettingsService);
  private alertService = inject(AlertService);

  private originalCurrentFormYear!: number;
  protected currentFormYear!: number;

  private originalCurrentYear!: number;
  protected currentYear!: number;

  private originalFormIsOpen!: boolean;
  protected formIsOpen!: boolean;

  private originalMaintenanceDate!: string;
  private maintenanceDate!: string;
  protected dateValue!: Date;

  protected settingsLoaded = false;
  protected loading = 0;


  ngOnInit(): void {
    this.getAllSettings();
  }

  private getAllSettings(): void {
    this.settingsService.getAll().subscribe({
      next: settings => {
        settings.forEach(setting => this.setSettingValue(setting));
        this.settingsLoaded = true;
      }
    });
  }

  private setSettingValue(setting: Setting): void {
    switch (setting.name) {
      case "currentFormYear":
        this.setCurrentFormYearValue(setting);
        break;
      case "formIsOpen":
        this.setFormIsOpenValue(setting);
        break;
      case "currentYear":
        this.setCurrentYearValue(setting);
        break;
      case "maintenance":
        this.setCurrentMaintenance(setting);
        break;
    }
  }

  private setCurrentFormYearValue(setting: Setting): void {
    this.currentFormYear = +setting.value - 2000;
    this.originalCurrentFormYear = this.currentFormYear;
  }

  private setFormIsOpenValue(setting: Setting): void {
    this.formIsOpen = setting.value == "1";
    this.originalFormIsOpen = this.formIsOpen;
  }

  private setCurrentYearValue(setting: Setting): void {
    this.currentYear = +setting.value - 2000;
    this.originalCurrentYear = this.currentYear;
  }

  private setCurrentMaintenance(setting: Setting): void {
    this.maintenanceDate = setting.value;
    this.originalMaintenanceDate = setting.value;
    if (setting.value != "0") this.dateValue = new Date(setting.value);
  }

  protected saveButtonDisabled(): boolean {
    return this.originalCurrentFormYear === this.currentFormYear
      && this.originalFormIsOpen === this.formIsOpen
      && this.originalCurrentYear === this.currentYear
      && this.originalMaintenanceDate === this.maintenanceDate;
  }

  protected clearDate(): void {
    this.maintenanceDate = "0";
  }

  protected setDate(date: Date): void {
    this.maintenanceDate = date.toISOString();
  }

  protected saveChanges() {
    this.updateSetting("currentFormYear", (2000 + this.originalCurrentFormYear).toString(), (2000 + this.currentFormYear).toString());
    this.updateSetting("currentYear", (2000 + this.originalCurrentYear).toString(), (2000 + this.currentYear).toString());
    this.updateSetting("formIsOpen", (+this.originalFormIsOpen).toString(), (+this.formIsOpen).toString());
    this.updateSetting("maintenance", this.originalMaintenanceDate, this.maintenanceDate);
  }

  private updateSetting(settingName: string, originalSettingValue: string, settingValue: string): void {
    if (originalSettingValue !== settingValue) {
      this.loading += 1;
      const settingToUpdate = {name: settingName, value: settingValue};
      this.settingsService.update(settingToUpdate).subscribe({
        next: setting => {
          this.setSettingValue(setting);
          this.alertService.sendMessage({
            title: "Éxito al guardar",
            message: `El ajuste "${setting.name}" se ha guardado con éxito`,
            severity: "success"
          });
          this.loading -= 1;
        },
        error: () => this.loading -= 1
      });
    }
  }
}
