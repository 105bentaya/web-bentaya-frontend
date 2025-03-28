import {Component, inject, OnInit} from '@angular/core';
import {DatePicker} from "primeng/datepicker";
import {FloatLabel} from "primeng/floatlabel";
import {Setting, SettingType} from "../../../settings/setting.model";
import {FormHelper} from "../../../../shared/util/form-helper";
import {SettingsService} from "../../../settings/settings.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputNumber} from "primeng/inputnumber";
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {forkJoin} from "rxjs";
import {AlertService} from "../../../../shared/services/alert-service.service";

@Component({
  selector: 'app-scout-center-settings',
  imports: [
    DatePicker,
    FloatLabel,
    ReactiveFormsModule,
    InputNumber,
    SaveButtonsComponent
  ],
  templateUrl: './scout-center-settings.component.html',
  styleUrl: './scout-center-settings.component.scss'
})
export class ScoutCenterSettingsComponent implements OnInit {

  private settingsService = inject(SettingsService);
  private alertService = inject(AlertService);
  protected readonly SettingType = SettingType;

  private settings!: Setting[];
  protected loading = false;


  protected formHelper = new FormHelper();

  ngOnInit() {
    this.getAllSettings();
  }

  private getAllSettings(): void {
    this.settingsService.getBookingSettings().subscribe({
      next: settings => this.initForm(settings)
    });
  }

  private initForm(settings: Setting[]) {
    this.settings = settings;
    this.formHelper.createForm(settings.reduce((acc, setting) => {
      const value = this.getSettingValue(setting);
      acc[setting.name] = new FormControl(value, Validators.required);
      return acc;
    }, {} as { [key: string]: FormControl }));
  }

  private getSettingValue(setting: Setting) {
    if (setting.type == "NUMBER") return +setting.value;
    if (setting.type == "DATE") return new Date(setting.value);
    return setting.value;
  }

  private settingValueIsEqual(setting: Setting, newValue: any): boolean {
    if (setting.type == "NUMBER") return +setting.value === newValue;
    if (setting.type == "DATE") return new Date(setting.value).toISOString() === new Date(newValue).toISOString();
    return false;
  }

  protected saveChanges() {
    if (this.formHelper.validateAll()) {
      const settingsToUpdate = Object.entries(this.formHelper.value)
        .filter(([k, v]) => !this.settingValueIsEqual(this.settings.find(s => s.name === k)!, v));

      if (settingsToUpdate.length > 0) this.updateSettings(settingsToUpdate as [SettingType, any][]);
    }
  }

  protected updateSettings(settingsToUpdate: [SettingType, any][]) {
    this.loading = true;
    const updates = settingsToUpdate.map(([key, v]) => this.settingsService.update(key, v));

    forkJoin(updates).subscribe({
      next: updatedSettings => {
        this.alertService.sendBasicSuccessMessage(this.getObservableMessage(updatedSettings));
        updatedSettings.forEach(setting => {
          this.settings.find(s => s.name === setting.name)!.value = setting.value;
        });
        this.loading = false;
      },
      error: () => {
        this.alertService.sendBasicErrorMessage("Error al guardar los ajustes. Recargue la página o avise a algún informático");
      }
    });
  }

  private getObservableMessage(settings: Setting[]) {
    if (settings.length > 1) {
      return `Los ajustes "${settings.map(s => s.name).join(', ')}" se han guardado con éxito`;
    }
    return `El ajuste "${settings[0].name}" se ha guardado con éxito`;
  }
}
