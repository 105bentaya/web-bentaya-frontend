import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialMemberListComponent } from './special-member-list.component';

describe('SpecialMemberListComponent', () => {
  let component: SpecialMemberListComponent;
  let fixture: ComponentFixture<SpecialMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
