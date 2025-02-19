import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableIconButtonComponent} from './table-icon-button.component';

describe('GeneralIconButtonComponent', () => {
  let component: TableIconButtonComponent;
  let fixture: ComponentFixture<TableIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableIconButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
