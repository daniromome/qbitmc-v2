import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TicksPipe } from '@pipes/ticks'
import { StatPipe } from '@pipes/stat'
import { FormsModule, ReactiveFormsModule, FormControl, NonNullableFormBuilder } from '@angular/forms'
import { AvatarPipe } from '@pipes/avatar'
import { PlayerStatistics } from '@models/player-statistics'
import {
  IonCard,
  IonCardHeader,
  IonItem,
  IonChip,
  IonLabel,
  IonCardContent,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonAvatar
} from '@ionic/angular/standalone'

@Component({
  selector: 'qbit-leaderboard',
  standalone: true,
  imports: [
    IonAvatar,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonChip,
    IonItem,
    IonCardHeader,
    IonCard,
    IonSelect,
    IonSelectOption,
    CommonModule,
    TicksPipe,
    StatPipe,
    AvatarPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
  @Input() public leaderboard?: PlayerStatistics[]
  public title?: string
  public control?: FormControl
  public isPlaytime = false

  public constructor(private readonly fb: NonNullableFormBuilder) {}

  @Input() public set stat(value: string) {
    this.title = value
    this.isPlaytime = value === 'minecraft:custom minecraft:play_time'
    if (this.isPlaytime) this.control = this.fb.control('hours')
  }
}
