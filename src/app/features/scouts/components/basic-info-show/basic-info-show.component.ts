import {Component, input, model} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-basic-info-show',
  imports: [
    NgClass
  ],
  templateUrl: './basic-info-show.component.html',
  styleUrl: './basic-info-show.component.scss'
})
export class BasicInfoShowComponent {
  label = input.required<string>();
  show = model.required<boolean>();
}
