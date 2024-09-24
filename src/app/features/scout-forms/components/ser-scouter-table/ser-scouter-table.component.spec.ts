import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SerScouterTableComponent} from './ser-scouter-table.component';

describe('SerScouterTableComponent', () => {
  let component: SerScouterTableComponent;
  let fixture: ComponentFixture<SerScouterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerScouterTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerScouterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
