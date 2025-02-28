import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonContainerComponent } from './radio-button-container.component';

describe('RadioButtonContainerComponent', () => {
  let component: RadioButtonContainerComponent;
  let fixture: ComponentFixture<RadioButtonContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButtonContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
