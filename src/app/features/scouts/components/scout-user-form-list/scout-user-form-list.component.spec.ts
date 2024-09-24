import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutUserFormListComponent} from './scout-user-form-list.component';

describe('ScoutUserFormListComponent', () => {
  let component: ScoutUserFormListComponent;
  let fixture: ComponentFixture<ScoutUserFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoutUserFormListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutUserFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
