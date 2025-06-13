import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EconomicDataComponent} from './economic-data.component';

describe('EconomicDataComponent', () => {
  let component: EconomicDataComponent;
  let fixture: ComponentFixture<EconomicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
