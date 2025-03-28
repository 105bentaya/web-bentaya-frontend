import {Component, inject, OnInit} from '@angular/core';
import {SettingsService} from "./settings.service";
import {Setting, settingFormType, SettingType} from "./setting.model";
import {AlertService} from "../../shared/services/alert-service.service";
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {BasicLoadingInfoComponent} from "../../shared/components/basic-loading-info/basic-loading-info.component";
import {SaveButtonsComponent} from "../../shared/components/buttons/save-buttons/save-buttons.component";
import {DatePicker} from "primeng/datepicker";
import {CheckboxContainerComponent} from "../../shared/components/checkbox-container/checkbox-container.component";
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {forkJoin} from "rxjs";
import {InputText} from "primeng/inputtext";
import {Dialog} from "primeng/dialog";
import {NgClass} from "@angular/common";

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
    DatePicker,
    CheckboxContainerComponent,
    FloatLabel,
    InputGroup,
    InputGroupAddon,
    InputText,
    Dialog,
    NgClass
  ]
})

export class SettingsComponent implements OnInit {

  private readonly emailRegex = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";
  private readonly singleEmailRegex = new RegExp(`^${this.emailRegex}$`);
  private readonly oneOrMoreMailRegex = new RegExp(`^(${this.emailRegex})(?:,(${this.emailRegex}))*$`);
  private readonly twoOrMoreMailRegex = new RegExp(`^(${this.emailRegex})(?:,(${this.emailRegex}))+$`);

  private readonly settingsService = inject(SettingsService);
  private readonly alertService = inject(AlertService);
  protected readonly SettingType = SettingType;

  protected settingsForm!: settingFormType;

  protected loading: boolean = false;
  protected dialogVisible: boolean = false;

  ngOnInit(): void {
    this.getAllSettings();
  }

  private getAllSettings(): void {
    this.settingsService.getGeneralSettings().subscribe({
      next: settings => {
        this.settingsForm = settings.reduce((acc, setting) => {
          const value = this.getSettingValue(setting);
          acc[setting.name] = {
            currentValue: value,
            originalValue: value,
            valueType: setting.type
          };
          return acc;
        }, {} as settingFormType);
      }
    });
  }

  private getSettingValue(setting: Setting) {
    if (setting.type == "BOOLEAN") return setting.value === "1";
    if (setting.type == "NUMBER") return +setting.value;
    if (setting.type == "DATE") return setting.value ? new Date(setting.value) : undefined;
    return setting.value;
  }

  protected saveButtonDisabled(): boolean {
    return !Object.values(this.settingsForm).some(a => a.currentValue !== a.originalValue);
  }

  protected saveChanges() {
    const modifiedKeys = Object.keys(this.settingsForm)
      .filter(k => {
        const setting = this.settingsForm[k as SettingType];
        return setting.originalValue !== setting.currentValue;
      }) as Array<SettingType>;

    let wrongEmails = false;
    modifiedKeys.filter(key => key.includes("MAIL"))
      .forEach(key => {
        const value = this.settingsForm[key].currentValue as string;
        if (key === "ADMINISTRATION_MAIL" && !RegExp(this.singleEmailRegex).exec(value) ||
          key === "COMPLAINT_MAIL" && !RegExp(this.twoOrMoreMailRegex).exec(value) ||
          !RegExp(this.oneOrMoreMailRegex).exec(value)
        ) {
          this.settingsForm[key].invalid = true;
          wrongEmails = true;
        } else {
          this.settingsForm[key].invalid = false;
        }
      });
    if (wrongEmails) {
      this.alertService.sendBasicErrorMessage("Hay correos inválidos, revise si están bien escritos o el número permitido en el panel de ayuda");
    } else {
      this.updateSettings(modifiedKeys);
    }
  }

  protected updateSettings(keys: SettingType[]) {
    this.loading = true;
    const updates = keys.map(key => this.settingsService.update(key, this.settingsForm[key].currentValue));

    forkJoin(updates).subscribe({
      next: updatedSettings => {
        this.alertService.sendBasicSuccessMessage(this.getObservableMessage(updatedSettings));
        updatedSettings.forEach(setting => {
          const settingForm = this.settingsForm[setting.name];
          const settingValue = this.getSettingValue(setting);
          settingForm.originalValue = settingValue;
          settingForm.currentValue = settingValue;
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
