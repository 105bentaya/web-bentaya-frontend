import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContinuePurchaseFormComponent} from './continue-purchase-form.component';

describe('ContinuePurchaseFormComponent', () => {
  let component: ContinuePurchaseFormComponent;
  let fixture: ComponentFixture<ContinuePurchaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinuePurchaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinuePurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
