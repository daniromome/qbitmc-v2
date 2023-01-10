import { TestBed } from '@angular/core/testing';

import { QbitorGuard } from './qbitor.guard';

describe('QbitorGuard', () => {
  let guard: QbitorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QbitorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
