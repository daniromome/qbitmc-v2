import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { ApplicationEffects } from './application.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: ApplicationEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(ApplicationEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
