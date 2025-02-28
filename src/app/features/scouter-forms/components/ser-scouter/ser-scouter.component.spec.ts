import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SerScouterComponent} from './ser-scouter.component';

describe('SerScouterComponent', () => {
  let component: SerScouterComponent;
  let fixture: ComponentFixture<SerScouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerScouterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerScouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
