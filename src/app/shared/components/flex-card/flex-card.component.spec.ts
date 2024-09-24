import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlexCardComponent} from './flex-card.component';

describe('FlexCardComponent', () => {
  let component: FlexCardComponent;
  let fixture: ComponentFixture<FlexCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlexCardComponent]
    });
    fixture = TestBed.createComponent(FlexCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
