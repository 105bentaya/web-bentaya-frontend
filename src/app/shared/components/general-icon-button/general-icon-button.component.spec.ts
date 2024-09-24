import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralIconButtonComponent } from './general-icon-button.component';

describe('GeneralIconButtonComponent', () => {
  let component: GeneralIconButtonComponent;
  let fixture: ComponentFixture<GeneralIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
