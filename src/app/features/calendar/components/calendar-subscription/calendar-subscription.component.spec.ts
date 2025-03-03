import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarSubscriptionComponent} from './calendar-subscription.component';

describe('CalendarSubscriptionComponent', () => {
  let component: CalendarSubscriptionComponent;
  let fixture: ComponentFixture<CalendarSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
