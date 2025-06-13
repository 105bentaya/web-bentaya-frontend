import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JamboreeInscriptionListComponent} from './jamboree-inscription-list.component';

describe('JamboreeInscriptionListComponent', () => {
  let component: JamboreeInscriptionListComponent;
  let fixture: ComponentFixture<JamboreeInscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JamboreeInscriptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JamboreeInscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
