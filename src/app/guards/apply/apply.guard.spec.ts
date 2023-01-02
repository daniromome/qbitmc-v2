import { TestBed } from '@angular/core/testing'

import { ApplyGuard } from './apply.guard'

describe('ApplyGuard', () => {
  let guard: ApplyGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(ApplyGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
