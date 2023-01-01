import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'qbit-note',
  standalone: true,
  imports: [CommonModule, IonicModule],
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
