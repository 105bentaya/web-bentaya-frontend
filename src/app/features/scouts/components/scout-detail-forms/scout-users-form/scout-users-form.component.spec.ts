import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutUsersFormComponent } from './scout-users-form.component';

describe('ScoutUsersFormComponent', () => {
  let component: ScoutUsersFormComponent;
  let fixture: ComponentFixture<ScoutUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutUsersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
