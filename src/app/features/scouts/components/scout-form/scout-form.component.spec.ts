import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutFormComponent} from './scout-form.component';

describe('ScoutFormComponent', () => {
  let component: ScoutFormComponent;
  let fixture: ComponentFixture<ScoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoutFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
