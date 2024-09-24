import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SerScoutComponent} from './ser-scout.component';

describe('SerScoutComponent', () => {
  let component: SerScoutComponent;
  let fixture: ComponentFixture<SerScoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerScoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerScoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
