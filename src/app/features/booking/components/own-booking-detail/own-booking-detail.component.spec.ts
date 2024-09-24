import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OwnBookingDetailComponent} from './own-booking-detail.component';

describe('OwnBookingDetailComponent', () => {
  let component: OwnBookingDetailComponent;
  let fixture: ComponentFixture<OwnBookingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnBookingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnBookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
