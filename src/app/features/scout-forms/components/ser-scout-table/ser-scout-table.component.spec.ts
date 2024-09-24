import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SerScoutTableComponent} from './ser-scout-table.component';

describe('SerScoutTableComponent', () => {
  let component: SerScoutTableComponent;
  let fixture: ComponentFixture<SerScoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerScoutTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerScoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
