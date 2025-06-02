import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicDataFormComponent } from './economic-data-form.component';

describe('EconomicDataFormComponent', () => {
  let component: EconomicDataFormComponent;
  let fixture: ComponentFixture<EconomicDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicDataFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
