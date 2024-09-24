import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingMenuComponent} from './booking-menu.component';

describe('BookingMenuComponent', () => {
  let component: BookingMenuComponent;
  let fixture: ComponentFixture<BookingMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingMenuComponent]
    });
    fixture = TestBed.createComponent(BookingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
