import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScouterAttendanceListComponent} from './scouter-attendance-list.component';

describe('ScouterAttendanceListComponent', () => {
  let component: ScouterAttendanceListComponent;
  let fixture: ComponentFixture<ScouterAttendanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScouterAttendanceListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScouterAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
