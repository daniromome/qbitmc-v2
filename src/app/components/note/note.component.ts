import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

import { IonText } from '@ionic/angular/standalone'

@Component({
  selector: 'qbit-note',
  standalone: true,
  imports: [IonText],
  templateUrl: './note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
  @Input() public invalid!: boolean
  @Input() public dirty!: boolean
  @Input() public helper!: string
  @Input() public error?: string

  public get slot(): string {
    return this.invalid || !this.dirty ? 'error' : 'helper'
  }
}
