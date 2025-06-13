import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpecialMemberNewFormComponent} from './special-member-new-form.component';

describe('SpecialMemberNewFormComponent', () => {
  let component: SpecialMemberNewFormComponent;
  let fixture: ComponentFixture<SpecialMemberNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberNewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
