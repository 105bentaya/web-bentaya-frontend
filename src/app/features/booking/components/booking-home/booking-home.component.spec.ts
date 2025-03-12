import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingHomeComponent} from './booking-home.component';

describe('BookingMenuComponent', () => {
  let component: BookingHomeComponent;
  let fixture: ComponentFixture<BookingHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingHomeComponent]
    });
    fixture = TestBed.createComponent(BookingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
