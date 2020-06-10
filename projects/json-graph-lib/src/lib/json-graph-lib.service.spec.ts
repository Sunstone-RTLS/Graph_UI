import { TestBed } from '@angular/core/testing';

import { JsonGraphLibService } from './json-graph-lib.service';

describe('JsonGraphLibService', () => {
  let service: JsonGraphLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonGraphLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
