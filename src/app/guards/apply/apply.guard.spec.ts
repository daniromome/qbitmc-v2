import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { applyGuard } from './apply.guard'

describe('applyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => applyGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
