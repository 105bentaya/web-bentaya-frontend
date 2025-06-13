import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpecialMemberDonationFormComponent} from './special-member-donation-form.component';

describe('SpecialMemberDonationFormComponent', () => {
  let component: SpecialMemberDonationFormComponent;
  let fixture: ComponentFixture<SpecialMemberDonationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberDonationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberDonationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
