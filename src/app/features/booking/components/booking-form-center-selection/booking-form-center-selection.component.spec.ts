import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingFormCenterSelectionComponent} from './booking-form-center-selection.component';

describe('BookingFormCenterSelectionComponent', () => {
  let component: BookingFormCenterSelectionComponent;
  let fixture: ComponentFixture<BookingFormCenterSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFormCenterSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormCenterSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
