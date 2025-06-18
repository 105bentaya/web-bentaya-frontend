import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesListComponent } from './fees-list.component';

describe('FeesListComponent', () => {
  let component: FeesListComponent;
  let fixture: ComponentFixture<FeesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
