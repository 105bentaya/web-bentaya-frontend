import {Component, inject, OnInit} from '@angular/core';
import {TabsModule} from "primeng/tabs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ScoutService} from "../../services/scout.service";
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {Tag} from "primeng/tag";
import {Button} from "primeng/button";
import {Scout, ScoutType} from "../../models/scout.model";
import {PersonalDataComponent} from "../scout-detail-tabs/personal-data/personal-data.component";
import {PersonalDataFormComponent} from "../scout-detail-forms/personal-data-form/personal-data-form.component";
import {AlertService} from "../../../../shared/services/alert-service.service";
import {ContactDataComponent} from "../scout-detail-tabs/contact-data/contact-data.component";
import {ContactDataFormComponent} from "../scout-detail-forms/contact-data-form/contact-data-form.component";
import {MedicalDataComponent} from "../scout-detail-tabs/medical-data/medical-data.component";
import {MedicalDataFormComponent} from "../scout-detail-forms/medical-data-form/medical-data-form.component";
import {GroupDataFormComponent} from "../scout-detail-forms/group-data-form/group-data-form.component";
import {GroupDataComponent} from "../scout-detail-tabs/group-data/group-data.component";
import {EconomicDataComponent} from "../scout-detail-tabs/economic-data/economic-data.component";
import {EconomicDataFormComponent} from "../scout-detail-forms/economic-data-form/economic-data-form.component";
import {CensusPipe} from "../../pipes/census.pipe";
import {AgePipe} from "../../pipes/age.pipe";
import {ScoutHistoryFormComponent} from "../scout-detail-forms/scout-history-form/scout-history-form.component";
import {ScoutHistoryComponent} from "../scout-detail-tabs/scout-history/scout-history.component";
import {ScoutSectionPipe} from "../../pipes/scout-section.pipe";
import {NgClass, NgTemplateOutlet, TitleCasePipe, UpperCasePipe} from "@angular/common";
import {ScoutGroupPipe} from "../../pipes/scout-group.pipe";
import {ScoutStatusPipe} from "../../pipes/scout-status.pipe";
import {SpecialRolePipe} from "../../../special-member/special-role.pipe";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserRole} from "../../../users/models/role.model";
import {ConfirmationService} from "primeng/api";

enum Permission {
  "BASIC_INFORMATION",
  "ALL_INFORMATION",
  "BASIC_EDITION",
  "FULL_EDITION"
}

type TabOptions = 'personal' | 'salud' | 'familiar' | 'asociativo' | 'scout' | 'economico';

@Component({
  selector: 'app-scout-detail',
  templateUrl: './scout-detail.component.html',
  styleUrls: ['./scout-detail.component.scss'],
  imports: [
    TabsModule,
    BasicLoadingInfoComponent,
    Tag,
    Button,
    PersonalDataComponent,
    PersonalDataFormComponent,
    ContactDataComponent,
    ContactDataFormComponent,
    MedicalDataComponent,
    MedicalDataFormComponent,
    GroupDataFormComponent,
    GroupDataComponent,
    EconomicDataComponent,
    EconomicDataFormComponent,
    CensusPipe,
    AgePipe,
    ScoutHistoryFormComponent,
    ScoutHistoryComponent,
    RouterLink,
    ScoutSectionPipe,
    TitleCasePipe,
    ScoutGroupPipe,
    ScoutStatusPipe,
    UpperCasePipe,
    SpecialRolePipe,
    NgClass,
    NgTemplateOutlet
  ]
})
export class ScoutDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scoutService = inject(ScoutService);
  private readonly alertService = inject(AlertService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly userData = inject(LoggedUserDataService);

  protected readonly Permission = Permission;

  protected scout!: Scout;
  protected selectedTab!: TabOptions;
  protected loading = true;
  protected deleteLoading = false;

  protected permission: Permission = Permission.BASIC_INFORMATION;
  protected editing: boolean = false;
  protected secretaryEdition: boolean = false;

  private readonly allTabs: { id: TabOptions; label: string; showIf: Permission; editIf: () => boolean }[] = [
    {
      id: 'personal',
      label: "Datos Personales",
      showIf: Permission.BASIC_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.BASIC_EDITION)
    },
    {
      id: 'salud',
      label: "Datos de Salud",
      showIf: Permission.BASIC_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.BASIC_EDITION)
    },
    {
      id: 'familiar',
      label: "Datos Familiares",
      showIf: Permission.BASIC_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.BASIC_EDITION)
    },
    {
      id: 'asociativo',
      label: "Datos Asociativos",
      showIf: Permission.ALL_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.FULL_EDITION)
    },
    {
      id: 'scout',
      label: "Historial Scout",
      showIf: Permission.ALL_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.FULL_EDITION) || this.permissionGreaterThan(Permission.BASIC_EDITION) && this.scout.scoutInfo.scoutType === "SCOUT"
    },
    {
      id: 'economico',
      label: "Datos Económicos",
      showIf: Permission.BASIC_INFORMATION,
      editIf: () => this.permissionGreaterThan(Permission.BASIC_EDITION) || this.userData.hasRequiredPermission(UserRole.TRANSACTION)
    },
  ];
  protected shownTabs: { id: TabOptions; label: string }[] = [];

  protected fromForm: boolean;
  protected fromFormStatus: "NONE" | "MEDICAL" = "NONE";
  protected fromScoutList = false;

  constructor() {
    this.fromForm = !!this.route.snapshot.queryParams['fromForm'];
    this.fromScoutList = !!this.route.snapshot.data['fromScoutList'];
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(data => {
        this.loading = true;
        this.scoutService.getById(data["id"]).subscribe(scout => {
          this.scout = scout;
          this.generateTabs();
        });
      });

    if (this.fromForm && this.permission >= Permission.BASIC_EDITION) {
      this.updateTab('salud');
      this.fromFormStatus = "MEDICAL";
      this.editing = true;
    }
  }

  private generateTabs() {
    if (this.userData.hasRequiredPermission(UserRole.SECRETARY)) {
      this.permission = Permission.FULL_EDITION;
    } else if (this.userData.hasRequiredPermission(UserRole.SCOUTER)) {
      const scoutType = this.scout.scoutInfo.scoutType;
      const scoutIsScouter = this.scout.id === this.userData.getScouter()?.id;
      const scouterHasScoutGroup = scoutType === "SCOUT" && this.userData.getScouterGroup()?.id === this.scout.scoutInfo.group?.id;
      this.permission = (scoutIsScouter || scouterHasScoutGroup) ? Permission.BASIC_EDITION : Permission.ALL_INFORMATION;
    } else {
      this.permission = Permission.BASIC_INFORMATION;
    }

    this.shownTabs = this.allTabs.filter(tab => this.permission >= tab.showIf);

    const tabQueryParam = this.route.snapshot.queryParams['tab'];
    if (this.allTabs.some(tab => tab.id === tabQueryParam)) {
      this.updateTab(tabQueryParam);
    } else {
      this.updateTab(JSON.parse(localStorage.getItem("scout_tab")!) ?? 'personal');
    }
    this.loading = false;
  }

  protected startEditing() {
    this.editing = this.currentTabEditionAllowed;
  }

  protected get scoutPersonalData() {
    return this.scout.personalData;
  }

  protected get personalDataWarning() {
    return this.scout.scoutInfo.scoutType === "SCOUT" && this.scout.usernames.length < 1;
  }

  protected get economicWarning() {
    return this.scout.scoutInfo.scoutType === "SCOUT" && !this.scout.contactList.some(contact => contact.donor);
  }

  protected onEditionStop(updatedMember: void | Scout) {
    if (updatedMember) {
      this.alertService.sendBasicSuccessMessage("Scout actualizado con éxito");
      this.scout = updatedMember;
    }
    if (this.fromFormStatus === "MEDICAL") {
      if (this.scout.scoutInfo.scoutType === "SCOUT") {
        this.updateTab('salud');
      } else {
        this.editing = false;
      }
      this.fromFormStatus = "NONE";
    } else {
      this.editing = false;
      this.secretaryEdition = false;
    }
  }

  protected updateTab(tab: TabOptions) {
    this.selectedTab = tab;
    localStorage.setItem("scout_tab", JSON.stringify(tab));
    this.router.navigate([], {queryParams: {tab}, replaceUrl: true});
  }

  protected get newScoutType(): ScoutType | undefined {
    if (this.secretaryEdition && this.scout.scoutInfo.status === "ACTIVE") {
      return "INACTIVE";
    }
    return undefined;
  }

  protected startSecretaryEdition() {
    this.secretaryEdition = true;
    this.selectedTab = 'asociativo';
    this.editing = true;
  }

  protected askForDelete() {
    this.deleteLoading = true;
    this.confirmationService.confirm({
      message: "¿Desea eliminar esta posible alta? Esta acción no se puede revertir.",
      header: "Eliminar Posible Alta",
      accept: () => this.deletePendingScout(),
      reject: () => this.deleteLoading = false
    });
  }

  protected deletePendingScout() {
    this.scoutService.deletePendingScout(this.scout.id).subscribe(() => {
      this.alertService.sendBasicSuccessMessage("Alta pendiente eliminada");
      this.router.navigateByUrl("/scouts");
    });
  }

  protected tabEditionAllowed(tabId: string) {
    return this.allTabs.find(tab => tab.id === tabId)?.editIf() ?? this.permissionGreaterThan(Permission.FULL_EDITION);
  }

  protected get currentTabEditionAllowed() {
    return this.tabEditionAllowed(this.selectedTab);
  }

  protected get economicEntryEditionAllowed() {
    return this.permission >= Permission.FULL_EDITION || this.userData.hasRequiredPermission(UserRole.TRANSACTION);
  }

  protected get hideEditButton() {
    return this.editing || !this.currentTabEditionAllowed;
  }

  private permissionGreaterThan(permission: Permission) {
    return this.permission >= permission;
  }

  protected tabHasWarning(id: TabOptions) {
    if (id === "economico") {
      return this.economicWarning;
    }
    if (id === "personal") {
      return this.personalDataWarning;
    }
    return false;
  }
}
