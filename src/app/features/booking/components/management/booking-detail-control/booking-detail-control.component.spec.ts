import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingDetailControlComponent} from './booking-detail-control.component';

describe('BookingDetailControlComponent', () => {
  let component: BookingDetailControlComponent;
  let fixture: ComponentFixture<BookingDetailControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
