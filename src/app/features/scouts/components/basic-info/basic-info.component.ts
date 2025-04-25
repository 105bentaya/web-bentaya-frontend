import {Component, input} from '@angular/core';

@Component({
  selector: 'app-basic-info',
  imports: [],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent {
  label = input.required<string>();
  value = input.required<string | undefined | null>();
  hideIfNull = input<boolean>(false);
}
