import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SerScoutControlComponent} from './ser-scout-control.component';

describe('SerScoutControlComponent', () => {
  let component: SerScoutControlComponent;
  let fixture: ComponentFixture<SerScoutControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerScoutControlComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerScoutControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
