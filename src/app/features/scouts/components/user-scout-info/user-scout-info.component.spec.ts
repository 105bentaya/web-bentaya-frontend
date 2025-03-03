import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserScoutInfoComponent} from './user-scout-info.component';

describe('UserScoutInfoComponent', () => {
  let component: UserScoutInfoComponent;
  let fixture: ComponentFixture<UserScoutInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserScoutInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserScoutInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
