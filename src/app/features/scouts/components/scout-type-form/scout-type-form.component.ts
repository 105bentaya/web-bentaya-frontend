import {Component, inject, input, OnInit, output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {GroupService} from "../../../../shared/services/group.service";
import {ScoutType} from "../../models/scout.model";
import {FloatLabel} from "primeng/floatlabel";
import {Select} from "primeng/select";
import {NgClass} from "@angular/common";
import {InputNumber} from "primeng/inputnumber";
import {BasicGroupInfo} from "../../../../shared/model/group.model";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {Message} from "primeng/message";
import {ScoutService} from "../../services/scout.service";
import {LoggedUserDataService} from "../../../../core/auth/services/logged-user-data.service";
import {UserRole} from "../../../users/models/role.model";
import {CensusPipe} from "../../pipes/census.pipe";

@Component({
  selector: 'app-scout-type-form',
  imports: [
    FloatLabel,
    Select,
    ReactiveFormsModule,
    NgClass,
    InputNumber,
    InputGroup,
    InputGroupAddon,
    Button,
    Tooltip,
    Message
  ],
  templateUrl: './scout-type-form.component.html',
  styleUrl: './scout-type-form.component.scss',
  providers: [CensusPipe]
})
export class ScoutTypeFormComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly scoutService = inject(ScoutService);
  private readonly userData = inject(LoggedUserDataService);
  private readonly censusPipe = inject(CensusPipe);

  parentForm = input.required<FormGroup | AbstractControl>();
  userIsSecretary = this.userData.hasRequiredPermission(UserRole.SECRETARY);

  protected lastCensus: number | undefined;
  protected originalCensus: number | undefined;
  protected lastExplorerCensus: number | undefined;
  protected readonly firstExplorerCensus = 95001;
  onGroupSelect = output<ScoutType>();

  protected groups!: BasicGroupInfo[];
  protected readonly scoutTypes: ({ label: string; value: ScoutType })[] = [
    {label: "Educanda", value: "SCOUT"},
    {label: "Educadora", value: "SCOUTER"}
  ];

  ngOnInit(): void {
    if (this.userIsSecretary) {
      this.originalCensus = this.census.value;
      this.scoutService.findLastCensus().subscribe(census => this.lastCensus = census);
      this.scoutService.findLastExplorerCensus().subscribe(census => this.lastExplorerCensus = census);
      this.scoutTypes.push(
        {label: "Comité de Grupo", value: "COMMITTEE"},
        {label: "Gestora", value: "MANAGER"},
        {label: "Sin unidad (Baja)", value: "INACTIVE"}
      );
    }
    this.groupService.getBasicGroups().subscribe(groups => {
      this.groups = groups;
      this.updateGroupSelect(this.scoutType.value);
    });
  }

  protected get censusPrefix(): string {
    return this.censusPipe.transform(this.census.value, {onlyPrefix: true});
  }

  protected get census(): FormControl {
    return this.parentForm().get('census') as FormControl;
  }

  protected get scoutType(): FormControl {
    return this.parentForm().get('scoutType') as FormControl;
  }

  protected get groupId(): FormControl {
    return this.parentForm().get('groupId') as FormControl;
  }

  get showGroup(): boolean {
    const scoutType: ScoutType = this.parentForm().get('scoutType')?.value;
    return scoutType === 'SCOUT' || scoutType === 'SCOUTER';
  }

  protected updateGroupSelect(value: ScoutType): void {
    if (value === 'SCOUT') {
      if (this.groups[0]?.id === 0) {
        this.groups.shift();
      }
      if (this.parentForm().get('groupId')?.value === 0) {
        this.parentForm().get('groupId')?.setValue(null);
      }
    } else if (this.groups[0]?.id !== 0) {
      this.groups.unshift(GroupService.generalGroup);
    }

    this.onGroupSelect.emit(value);
  }

  protected autoCompleteLastCensus() {
    this.census.setValue(this.lastCensus! + 1);
  }

  protected autoCompleteLastExplorerCensus() {
    this.census.setValue(this.lastExplorerCensus! + 1);
  }

  protected get censusIsGreaterThanLast() {
    return this.lastCensus && this.census.value > this.lastCensus + 1;
  }

  protected get explorerCensusIsGreaterThanLast() {
    return this.lastExplorerCensus && this.census.value > this.lastExplorerCensus + 1;
  }

  protected get canBeExplorer() {
    return (!this.originalCensus || this.originalCensus >= this.firstExplorerCensus) && this.scoutType.value === "INACTIVE";
  }
}
