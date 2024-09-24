import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SeniorFormComponent} from './senior-form.component';

describe('SeniorSectionComponent', () => {
  let component: SeniorFormComponent;
  let fixture: ComponentFixture<SeniorFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeniorFormComponent]
    });
    fixture = TestBed.createComponent(SeniorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
