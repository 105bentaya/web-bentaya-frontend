import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrivacyCheckboxContainerComponent} from './privacy-checkbox-container.component';

describe('PrivacyCheckboxContainerComponent', () => {
  let component: PrivacyCheckboxContainerComponent;
  let fixture: ComponentFixture<PrivacyCheckboxContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyCheckboxContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PrivacyCheckboxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
