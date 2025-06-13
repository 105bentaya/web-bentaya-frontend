import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpecialMemberDonationInfoComponent} from './special-member-donation-info.component';

describe('SpecialMemberDonationInfoComponent', () => {
  let component: SpecialMemberDonationInfoComponent;
  let fixture: ComponentFixture<SpecialMemberDonationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberDonationInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberDonationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
