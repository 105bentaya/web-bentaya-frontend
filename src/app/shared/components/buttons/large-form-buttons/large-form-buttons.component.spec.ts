import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LargeFormButtonsComponent} from './large-form-buttons.component';

describe('LargeFormButtonsComponent', () => {
  let component: LargeFormButtonsComponent;
  let fixture: ComponentFixture<LargeFormButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeFormButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeFormButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
