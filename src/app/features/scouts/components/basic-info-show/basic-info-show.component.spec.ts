import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoShowComponent } from './basic-info-show.component';

describe('BasicInfoShowComponent', () => {
  let component: BasicInfoShowComponent;
  let fixture: ComponentFixture<BasicInfoShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicInfoShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicInfoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
