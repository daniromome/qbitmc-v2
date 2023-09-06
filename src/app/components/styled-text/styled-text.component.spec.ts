import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StyledTextComponent } from './styled-text.component'

describe('StyledTextComponent', () => {
  let component: StyledTextComponent
  let fixture: ComponentFixture<StyledTextComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StyledTextComponent]
    })
    fixture = TestBed.createComponent(StyledTextComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
