import {Component, Input} from '@angular/core';
import {BlogInfo} from "../../../features/blog/models/blog-info.model";
import {RouterLink} from '@angular/router';
import {SharedModule} from 'primeng/api';
import {GalleriaModule} from 'primeng/galleria';

@Component({
  selector: 'app-bulletin-board',
  templateUrl: './bulletin-board.component.html',
  styleUrls: ['./bulletin-board.component.scss'],
  standalone: true,
  imports: [GalleriaModule, SharedModule, RouterLink]
})
export class BulletinBoardComponent {

  @Input() items: BlogInfo[] = [];
}
