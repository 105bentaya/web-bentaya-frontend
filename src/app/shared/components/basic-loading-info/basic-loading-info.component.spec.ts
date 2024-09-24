import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicLoadingInfoComponent} from './basic-loading-info.component';

describe('BasicLoadingInfoComponent', () => {
  let component: BasicLoadingInfoComponent;
  let fixture: ComponentFixture<BasicLoadingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicLoadingInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BasicLoadingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
