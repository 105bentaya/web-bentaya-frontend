import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {SpecialMemberService} from "../../special-member.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-special-member-list',
  imports: [
    Button,
    TableModule,
    RouterLink
  ],
  templateUrl: './special-member-list.component.html',
  styleUrl: './special-member-list.component.scss'
})
export class SpecialMemberListComponent implements OnInit {

  private readonly specialMemberService = inject(SpecialMemberService);

  ngOnInit() {
    this.specialMemberService.getSpecialMembers().subscribe(res => console.log(res));
  }
}
