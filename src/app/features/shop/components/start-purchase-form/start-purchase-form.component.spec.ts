import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StartPurchaseFormComponent} from './start-purchase-form.component';

describe('StartPurchaseFormComponent', () => {
  let component: StartPurchaseFormComponent;
  let fixture: ComponentFixture<StartPurchaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPurchaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
