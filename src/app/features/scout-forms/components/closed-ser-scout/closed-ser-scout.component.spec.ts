import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClosedSerScoutComponent} from './closed-ser-scout.component';

describe('ClosedSerScoutComponent', () => {
  let component: ClosedSerScoutComponent;
  let fixture: ComponentFixture<ClosedSerScoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClosedSerScoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedSerScoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
