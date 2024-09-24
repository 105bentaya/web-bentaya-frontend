import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DonationMenuComponent} from './donation-menu.component';

describe('DonationMenuComponent', () => {
  let component: DonationMenuComponent;
  let fixture: ComponentFixture<DonationMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationMenuComponent]
    });
    fixture = TestBed.createComponent(DonationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
