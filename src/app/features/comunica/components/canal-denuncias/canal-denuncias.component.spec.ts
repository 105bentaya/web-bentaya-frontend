import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CanalDenunciasComponent} from './canal-denuncias.component';

describe('CanalDenunciasComponent', () => {
  let component: CanalDenunciasComponent;
  let fixture: ComponentFixture<CanalDenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanalDenunciasComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalDenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
