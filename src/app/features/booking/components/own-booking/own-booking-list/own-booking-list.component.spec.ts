import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OwnBookingListComponent} from './own-booking-list.component';

describe('OwnBookingListComponent', () => {
  let component: OwnBookingListComponent;
  let fixture: ComponentFixture<OwnBookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnBookingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
