import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBetaAlertComponent } from './booking-beta-alert.component';

describe('BookingBetaAlertComponent', () => {
  let component: BookingBetaAlertComponent;
  let fixture: ComponentFixture<BookingBetaAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingBetaAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingBetaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
