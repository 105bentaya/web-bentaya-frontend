import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutInfoComponent} from './scout-info.component';

describe('ScoutInfoComponent', () => {
  let component: ScoutInfoComponent;
  let fixture: ComponentFixture<ScoutInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoutInfoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
