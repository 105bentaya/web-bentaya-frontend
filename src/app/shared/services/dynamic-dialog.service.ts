import {inject, Injectable, Type} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Injectable({
  providedIn: 'root'
})
export class DynamicDialogService {

  private readonly dialogService = inject(DialogService);
  private readonly widths = {
    "small": "700px",
    "medium": "950px",
    "large": "1200px",
  };

  constructor() {
  }

  openDialog<T>(componentType: Type<T>, header: string, width: "small" | "medium" | "large", data?: any): DynamicDialogRef {
    return this.dialogService.open(componentType, {
      header,
      closable: true,
      data,
      breakpoints: {
        '700px': '100vw'
      },
      width: this.widths[width],
      focusOnShow: false
    });
  }
}

// @media screen and (min-width: 700px) {
//     min-width: 700px;
//     max-width: 1200px;
