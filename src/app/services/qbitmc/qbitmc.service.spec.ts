import { TestBed } from '@angular/core/testing'

import { QbitmcService } from './qbitmc.service'

describe('QbitmcService', () => {
  let service: QbitmcService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(QbitmcService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
