import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingDocumentHelpComponent} from './booking-document-help.component';

describe('BookingDocumentHelpComponent', () => {
  let component: BookingDocumentHelpComponent;
  let fixture: ComponentFixture<BookingDocumentHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDocumentHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDocumentHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
