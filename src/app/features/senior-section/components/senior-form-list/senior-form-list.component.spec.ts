import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SeniorFormListComponent} from './senior-form-list.component';

describe('SeniorFormListComponent', () => {
  let component: SeniorFormListComponent;
  let fixture: ComponentFixture<SeniorFormListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeniorFormListComponent]
    });
    fixture = TestBed.createComponent(SeniorFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
