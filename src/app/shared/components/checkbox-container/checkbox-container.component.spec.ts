import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckboxContainerComponent} from './checkbox-container.component';

describe('PrivacyCheckboxContainerComponent', () => {
  let component: CheckboxContainerComponent;
  let fixture: ComponentFixture<CheckboxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CheckboxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
