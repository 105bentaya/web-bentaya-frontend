import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutCenterManagementComponent } from './scout-center-management.component';

describe('ScoutCenterManagementComponent', () => {
  let component: ScoutCenterManagementComponent;
  let fixture: ComponentFixture<ScoutCenterManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutCenterManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutCenterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
