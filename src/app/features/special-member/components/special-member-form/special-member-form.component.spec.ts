import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpecialMemberFormComponent} from './special-member-form.component';

describe('SpecialMemberFormComponent', () => {
  let component: SpecialMemberFormComponent;
  let fixture: ComponentFixture<SpecialMemberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
