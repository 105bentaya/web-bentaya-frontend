import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialMemberDetailComponent } from './special-member-detail.component';

describe('SpecialMemberDetailComponent', () => {
  let component: SpecialMemberDetailComponent;
  let fixture: ComponentFixture<SpecialMemberDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
