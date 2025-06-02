import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoutHistoryComponent} from './scout-history.component';

describe('MedicalDataComponent', () => {
  let component: ScoutHistoryComponent;
  let fixture: ComponentFixture<ScoutHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
