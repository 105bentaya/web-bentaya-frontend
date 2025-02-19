import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneralAButtonComponent} from './general-a-button.component';

describe('GeneralAButtonComponent', () => {
  let component: GeneralAButtonComponent;
  let fixture: ComponentFixture<GeneralAButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralAButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralAButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
