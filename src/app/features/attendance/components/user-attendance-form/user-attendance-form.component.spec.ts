import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserAttendanceFormComponent} from './user-attendance-form.component';

describe('AttendanceFormComponent', () => {
  let component: UserAttendanceFormComponent;
  let fixture: ComponentFixture<UserAttendanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAttendanceFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAttendanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
