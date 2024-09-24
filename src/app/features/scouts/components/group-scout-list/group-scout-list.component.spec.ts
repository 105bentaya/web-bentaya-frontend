import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupScoutListComponent} from './group-scout-list.component';

describe('GroupScoutListComponent', () => {
  let component: GroupScoutListComponent;
  let fixture: ComponentFixture<GroupScoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupScoutListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupScoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
