import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationFormListComponent } from './donation-form-list.component';

describe('DonationFormListComponent', () => {
  let component: DonationFormListComponent;
  let fixture: ComponentFixture<DonationFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationFormListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
