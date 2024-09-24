import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {FormTextAreaComponent} from '../../../../shared/components/form-text-area/form-text-area.component';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {NgClass, NgIf} from '@angular/common';
import {FloatLabelModule} from "primeng/floatlabel";
import {SaveButtonsComponent} from "../../../../shared/components/save-buttons/save-buttons.component";

@Component({
  selector: 'app-booking-status-update',
  templateUrl: './booking-status-update.component.html',
  styleUrls: ['./booking-status-update.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    FloatLabelModule,
    InputNumberModule,
    FormsModule,
    FormTextAreaComponent,
    ButtonDirective,
    SaveButtonsComponent
  ]
})
export class BookingStatusUpdateComponent implements OnInit {

  protected ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private confirmationService = inject(ConfirmationService);

  protected floatLabel: string = "Observaciones";
  protected required: boolean = false;
  protected showPrice: boolean = false;
  protected message!: string;
  protected comment!: string;
  protected price!: number;
  protected validText!: boolean;

  ngOnInit(): void {
    this.floatLabel = this.config.data.floatLabel;
    this.required = this.config.data.required;
    this.showPrice = this.config.data.showPrice;
    this.message = this.config.data.message;
  }

  protected submit() {
    this.confirmationService.confirm({
      message: "¿Desea confirmar los datos actuales?",
      accept: () => this.ref.close({comment: this.comment, price: this.price})
    });
  }

  protected disableUpdateButton() {
    return !this.validText ||
      this.required && (!this.comment || this.comment.trim().length == 0) ||
      this.showPrice && !this.price;
  }
}
