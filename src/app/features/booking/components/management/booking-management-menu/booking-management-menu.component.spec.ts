import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingManagementMenuComponent} from './booking-management-menu.component';

describe('BookingManagementComponent', () => {
  let component: BookingManagementMenuComponent;
  let fixture: ComponentFixture<BookingManagementMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingManagementMenuComponent]
    });
    fixture = TestBed.createComponent(BookingManagementMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
