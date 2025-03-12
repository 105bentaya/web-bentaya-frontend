import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingStatusUpdateComponent} from './booking-status-update.component';

describe('BookingStatusUpdateComponent', () => {
  let component: BookingStatusUpdateComponent;
  let fixture: ComponentFixture<BookingStatusUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingStatusUpdateComponent]
    });
    fixture = TestBed.createComponent(BookingStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
