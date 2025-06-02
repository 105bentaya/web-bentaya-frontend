import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDataFormComponent } from './medical-data-form.component';

describe('MedicalDataFormComponent', () => {
  let component: MedicalDataFormComponent;
  let fixture: ComponentFixture<MedicalDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalDataFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
