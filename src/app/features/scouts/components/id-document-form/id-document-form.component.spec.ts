import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdDocumentFormComponent } from './id-document-form.component';

describe('IdDocumentFormComponent', () => {
  let component: IdDocumentFormComponent;
  let fixture: ComponentFixture<IdDocumentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdDocumentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdDocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
