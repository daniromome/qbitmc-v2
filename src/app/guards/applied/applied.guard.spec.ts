import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { appliedGuard } from './applied.guard'

describe('appliedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => appliedGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
