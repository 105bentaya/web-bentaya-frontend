import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingFollowUpComponent} from './booking-follow-up.component';

describe('BookingFollowUpComponent', () => {
  let component: BookingFollowUpComponent;
  let fixture: ComponentFixture<BookingFollowUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingFollowUpComponent]
    });
    fixture = TestBed.createComponent(BookingFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
