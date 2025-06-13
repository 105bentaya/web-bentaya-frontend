import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OwnBookingFollowUpComponent} from './own-booking-follow-up.component';

describe('OwnBookingFollowUpComponent', () => {
  let component: OwnBookingFollowUpComponent;
  let fixture: ComponentFixture<OwnBookingFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnBookingFollowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnBookingFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
