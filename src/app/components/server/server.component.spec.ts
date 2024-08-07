import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ServerTileComponent } from './server.component'

describe('ServerComponent', () => {
  let component: ServerTileComponent
  let fixture: ComponentFixture<ServerTileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerTileComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ServerTileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
