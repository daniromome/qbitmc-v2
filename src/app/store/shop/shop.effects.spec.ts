import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { ShopEffects } from './shop.effects'

describe('AppEffects', () => {
  let actions$: Observable<any>
  let effects: ShopEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopEffects, provideMockActions(() => actions$)]
    })

    effects = TestBed.inject(ShopEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
