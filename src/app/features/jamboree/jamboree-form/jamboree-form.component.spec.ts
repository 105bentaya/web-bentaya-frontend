import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JamboreeFormComponent} from './jamboree-form.component';

describe('JamboreeFormComponent', () => {
  let component: JamboreeFormComponent;
  let fixture: ComponentFixture<JamboreeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JamboreeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JamboreeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
