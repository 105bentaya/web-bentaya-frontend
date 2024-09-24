import {TestBed} from '@angular/core/testing';

import {ScouterFormsService} from './scouter-forms.service';

describe('ScouterFormsService', () => {
  let service: ScouterFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScouterFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
