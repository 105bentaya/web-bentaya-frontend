import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScouterAttendanceFormComponent} from './scouter-attendance-form.component';

describe('ScouterAttendanceFormComponent', () => {
  let component: ScouterAttendanceFormComponent;
  let fixture: ComponentFixture<ScouterAttendanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScouterAttendanceFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScouterAttendanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
