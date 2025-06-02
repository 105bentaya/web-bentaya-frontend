import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutHistoryFormComponent} from './scout-history-form.component';

describe('MedicalDataFormComponent', () => {
  let component: ScoutHistoryFormComponent;
  let fixture: ComponentFixture<ScoutHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutHistoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
