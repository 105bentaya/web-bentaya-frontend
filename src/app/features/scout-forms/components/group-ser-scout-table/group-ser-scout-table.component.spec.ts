import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupSerScoutTableComponent} from './group-ser-scout-table.component';

describe('GroupSerScoutTableComponent', () => {
  let component: GroupSerScoutTableComponent;
  let fixture: ComponentFixture<GroupSerScoutTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupSerScoutTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSerScoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
