import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { ApplicationStoreModule } from '@store/application'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [CommonModule, IonicModule, ApplicationStoreModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {

}
