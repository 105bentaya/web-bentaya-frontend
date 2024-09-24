import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserAttendanceListComponent} from './user-attendance-list.component';

describe('UserAttendanceListComponent', () => {
  let component: UserAttendanceListComponent;
  let fixture: ComponentFixture<UserAttendanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAttendanceListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
