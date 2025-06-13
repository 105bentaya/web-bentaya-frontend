import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentFileUploaderComponent} from './document-file-uploader.component';

describe('DocumentFileUploaderComponent', () => {
  let component: DocumentFileUploaderComponent;
  let fixture: ComponentFixture<DocumentFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentFileUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
