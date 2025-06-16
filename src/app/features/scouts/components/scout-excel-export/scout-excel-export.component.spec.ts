import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutExcelExportComponent } from './scout-excel-export.component';

describe('ScoutExcelExportComponent', () => {
  let component: ScoutExcelExportComponent;
  let fixture: ComponentFixture<ScoutExcelExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoutExcelExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoutExcelExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
