import {Component, input, output} from '@angular/core';
import {Scout} from "../../models/member.model";

@Component({
  selector: 'app-group-data-form',
  imports: [],
  templateUrl: './group-data-form.component.html',
  styleUrl: './group-data-form.component.scss'
})
export class GroupDataFormComponent {
  initialData = input<Scout>();
  protected onEditionStop = output<void | Scout>();
}
