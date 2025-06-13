import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutCenterSettingsComponent} from './scout-center-settings.component';

describe('ScoutCenterSettingsComponent', () => {
  let component: ScoutCenterSettingsComponent;
  let fixture: ComponentFixture<ScoutCenterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutCenterSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutCenterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
