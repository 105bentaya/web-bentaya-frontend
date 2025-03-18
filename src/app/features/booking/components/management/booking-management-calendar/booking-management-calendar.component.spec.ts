import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingManagementCalendarComponent} from './booking-management-calendar.component';

describe('BookingManagementCalendarComponent', () => {
  let component: BookingManagementCalendarComponent;
  let fixture: ComponentFixture<BookingManagementCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingManagementCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingManagementCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
