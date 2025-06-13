import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EconomicEntryInfoComponent} from './economic-entry-info.component';

describe('EconomicEntryInfoComponent', () => {
  let component: EconomicEntryInfoComponent;
  let fixture: ComponentFixture<EconomicEntryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicEntryInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicEntryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
