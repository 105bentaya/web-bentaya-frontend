import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactFormListComponent} from './contact-form-list.component';

describe('ContactFormListComponent', () => {
  let component: ContactFormListComponent;
  let fixture: ComponentFixture<ContactFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactFormListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
