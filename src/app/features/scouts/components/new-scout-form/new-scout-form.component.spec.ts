import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewScoutFormComponent} from './new-scout-form.component';

describe('NewScoutFormComponent', () => {
  let component: NewScoutFormComponent;
  let fixture: ComponentFixture<NewScoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewScoutFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
