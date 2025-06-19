import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DonationFileFormComponent} from './donation-file-form.component';

describe('DonationFileFormComponent', () => {
  let component: DonationFileFormComponent;
  let fixture: ComponentFixture<DonationFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationFileFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
