import { TestBed } from '@angular/core/testing';

import { AppliedGuard } from './applied.guard';

describe('AppliedGuard', () => {
  let guard: AppliedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppliedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
