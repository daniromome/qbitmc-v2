import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NicknameEditorComponent } from './nickname-editor.component'

describe('NicknameEditorComponent', () => {
  let component: NicknameEditorComponent
  let fixture: ComponentFixture<NicknameEditorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NicknameEditorComponent]
    })
    fixture = TestBed.createComponent(NicknameEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
