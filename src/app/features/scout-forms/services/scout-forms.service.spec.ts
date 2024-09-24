import {TestBed} from '@angular/core/testing';

import {ScoutFormsService} from './scout-forms.service';

describe('SerScoutService', () => {
  let service: ScoutFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoutFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
