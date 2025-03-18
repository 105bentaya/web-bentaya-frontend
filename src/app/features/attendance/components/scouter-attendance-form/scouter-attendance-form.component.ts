import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ConfirmationService} from "../../services/confirmation.service";
import {EventAttendanceInfo} from "../../models/event-attendance-info.model";
import {Confirmation} from "../../models/confirmation.model";
import FilterUtils from "../../../../shared/util/filter-utils";
import {finalize, forkJoin, tap} from "rxjs";
import {ScoutsPipe} from '../../../../shared/pipes/scouts.pipe';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {SaveButtonsComponent} from "../../../../shared/components/buttons/save-buttons/save-buttons.component";
import {
  CheckboxContainerComponent
} from "../../../../shared/components/checkbox-container/checkbox-container.component";
import {FloatLabel} from "primeng/floatlabel";

@Component({
  selector: 'app-scouter-attendance-form',
  templateUrl: './scouter-attendance-form.component.html',
  styleUrls: ['./scouter-attendance-form.component.scss'],
  imports: [
    CheckboxModule,
    FormsModule,
    MultiSelectModule,
    AutoCompleteModule,
    ScoutsPipe,
    SelectButtonModule,
    FormTextAreaComponent,
    SaveButtonsComponent,
    CheckboxContainerComponent,
    FloatLabel
  ]
})
export class ScouterAttendanceFormComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly confirmationService = inject(ConfirmationService);

  private info!: EventAttendanceInfo[];
  protected filteredInfo!: EventAttendanceInfo[];
  protected selectedConfirmation: Confirmation | undefined;
  protected hasPayment!: boolean;
  protected multiple = false;
  protected selectedInfo: EventAttendanceInfo[] = [];
  protected groupedInfo: { attendLabel: string, items: EventAttendanceInfo[] }[] = [];
  protected multipleAttending: boolean | null | undefined;
  protected multiplePaying!: boolean | null;
  protected infoAttending: number = 0;
  protected infoNotAttending: number = 0;
  protected infoNotConfirmed: number = 0;
  protected infoPayed: number = 0;
  protected infoNotPayed: number = 0;
  private eventId!: number;
  protected validText: boolean = true;
  protected loading: boolean = false;

  protected paymentOptions = [{label: 'Sí', value: true}, {label: 'No', value: false}];
  protected multiplePaymentOptions = [
    {label: 'Sí', value: true},
    {label: 'No', value: false},
    {label: 'No Editar', value: null}
  ];
  protected attendanceOptions = [
    {label: 'Sí', value: true},
    {label: 'No', value: false},
    {label: 'NS/NC', value: null, title: "Sin Confirmar"}
  ];

  ngOnInit(): void {
    if (this.config.data.eventId) {
      this.hasPayment = this.config.data.payment;
      this.eventId = this.config.data.eventId;
      this.confirmationService.getEventAttendanceInfo(this.eventId).subscribe({
        next: data => {
          this.info = data.sort((a, b) => a.surname.localeCompare(b.surname));
          this.generateGroupedInfo();
        }
      });
    }
  }

  private generateGroupedInfo() {
    const notConfirmed = this.info.filter(data => data.attending === null);
    const notAttending = this.info.filter(data => data.attending === false);
    const attending = this.info.filter(data => data.attending === true);
    const groupedInfo: { attendLabel: string, items: EventAttendanceInfo[] }[] = [];
    if (notConfirmed.length > 0) {
      groupedInfo.push({attendLabel: "NS/NC", items: this.info.filter(data => data.attending === null)});
    }
    if (notAttending.length > 0) {
      groupedInfo.push({attendLabel: "No Asisten", items: this.info.filter(data => data.attending === false)},);
    }
    if (attending.length > 0) {
      groupedInfo.push({attendLabel: "Asisten", items: this.info.filter(data => data.attending === true)});
    }
    this.groupedInfo = groupedInfo;
  }

  protected autocompleteFilterAttendance(event: any) {
    this.filteredInfo = [];
    const query = FilterUtils.queryString(event.query);
    this.filteredInfo = this.info.filter(data => FilterUtils.findPersonInFilter(data, query));
  }

  protected onAutoCompleteSelect(value: EventAttendanceInfo) {
    this.selectedConfirmation = {
      scoutId: value.scoutId,
      eventId: this.eventId,
      text: value.text,
      attending: value.attending,
      payed: value.payed
    };
  }

  protected onSelectionCheckboxChange() {
    this.selectedConfirmation = undefined;
    this.selectedInfo = [];
  }

  protected onSingleSubmit(value: Confirmation) {
    this.loading = true;
    this.updateConfirmation(value).pipe(finalize(() => this.loading = false)).subscribe();
  }

  //todo improve to allow more dynamic selection, including checkbox with minus sign
  protected onMultipleGroupSelect(items: EventAttendanceInfo[]) {
    this.selectedInfo = items;
    this.onMultipleSelect();
  }

  protected onMultipleSelect() {
    this.infoAttending = this.selectedInfo.filter(info => info.attending === true).length;
    this.infoNotAttending = this.selectedInfo.filter(info => info.attending === false).length;
    this.infoNotConfirmed = this.selectedInfo.filter(info => info.attending === null).length;

    if (this.infoAttending > 0 && this.infoNotAttending < 1 && this.infoNotConfirmed < 1) {
      this.multipleAttending = true;
    } else if (this.infoAttending < 1 && this.infoNotAttending > 0 && this.infoNotConfirmed < 1) {
      this.multipleAttending = false;
    } else if (this.infoAttending < 1 && this.infoNotAttending < 1 && this.infoNotConfirmed > 0) {
      this.multipleAttending = null;
    } else {
      this.multipleAttending = undefined;
    }

    if (this.hasPayment) {
      this.infoPayed = this.selectedInfo.filter(info => info.payed).length;
      this.infoNotPayed = this.selectedInfo.length - this.infoPayed;
      this.multiplePaying = null;
    }
  }

  protected onMultipleSubmit() {
    this.loading = true;
    forkJoin(this.selectedInfo.map(info => {
      const confirmation: Confirmation = {
        scoutId: info.scoutId,
        eventId: this.eventId,
        text: info.text,
        attending: info.attending,
        payed: info.payed
      };
      confirmation.attending = this.multipleAttending!;
      if (this.multiplePaying === true || this.multiplePaying === false) confirmation.payed = this.multiplePaying;
      return this.updateConfirmation(confirmation);
    })).pipe(finalize(() => {
      this.loading = false;
      this.generateGroupedInfo();
      this.onMultipleSelect();
    })).subscribe();
  }

  private updateConfirmation(confirmation: Confirmation) {
    return this.confirmationService.updateByScouter(confirmation).pipe(tap(
      value => {
        const existingScout = this.info.find(a => a.scoutId == value.scoutId);
        existingScout!.attending = value.attending;
        existingScout!.payed = value.payed;
        existingScout!.text = value.text;
      }
    ));
  }
}
