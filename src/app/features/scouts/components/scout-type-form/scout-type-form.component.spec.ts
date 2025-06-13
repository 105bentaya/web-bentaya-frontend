import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutTypeFormComponent} from './scout-type-form.component';

describe('ScoutTypeFormComponent', () => {
  let component: ScoutTypeFormComponent;
  let fixture: ComponentFixture<ScoutTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
