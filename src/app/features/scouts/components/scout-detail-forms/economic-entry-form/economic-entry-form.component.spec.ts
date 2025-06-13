import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EconomicEntryFormComponent} from './economic-entry-form.component';

describe('EconomicEntryFormComponent', () => {
  let component: EconomicEntryFormComponent;
  let fixture: ComponentFixture<EconomicEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicEntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
