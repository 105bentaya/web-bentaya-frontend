import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DonationManagementComponent} from './donation-management.component';

describe('DonationListComponent', () => {
  let component: DonationManagementComponent;
  let fixture: ComponentFixture<DonationManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationManagementComponent]
    });
    fixture = TestBed.createComponent(DonationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
