import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { LeaderboardExtendedRecord } from '@models/leaderboards'
import { TicksPipe } from '@pipes/ticks'
import { StatPipe } from '@pipes/stat'
import { FormsModule, ReactiveFormsModule, FormControl, NonNullableFormBuilder } from '@angular/forms'

@Component({
  selector: 'qbit-leaderboard',
  standalone: true,
  imports: [CommonModule, IonicModule, TicksPipe, StatPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
  @Input() public leaderboard?: LeaderboardExtendedRecord[]
  public title?: string
  public control?: FormControl
  public isPlaytime = false

  public constructor(
    private readonly fb: NonNullableFormBuilder
  ) {}

  @Input() public set stat(value: string) {
    this.title = value
    this.isPlaytime = value === 'minecraft:play_time'
    if (this.isPlaytime) this.control = this.fb.control('hours')
  }
}
