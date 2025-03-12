import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OwnBookingFormComponent} from './own-booking-form.component';

describe('OwnBookingFormComponent', () => {
  let component: OwnBookingFormComponent;
  let fixture: ComponentFixture<OwnBookingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnBookingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
