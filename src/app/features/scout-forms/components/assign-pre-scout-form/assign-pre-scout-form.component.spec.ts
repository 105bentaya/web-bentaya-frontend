import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssignPreScoutFormComponent} from './assign-pre-scout-form.component';

describe('AssignPreScoutFormComponent', () => {
  let component: AssignPreScoutFormComponent;
  let fixture: ComponentFixture<AssignPreScoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignPreScoutFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPreScoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
