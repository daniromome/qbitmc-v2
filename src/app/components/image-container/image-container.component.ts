import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { BytesPipe } from '@pipes/bytes'
import { IonChip, IonButton, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { close } from 'ionicons/icons'

@Component({
  selector: 'qbit-image-container',
  standalone: true,
  imports: [IonIcon, IonButton, IonChip, BytesPipe],
  templateUrl: './image-container.component.html',
  styleUrl: './image-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageContainerComponent {
  public src = input<string>()
  public size = input<number>()
  public delete = output<void>()

  public constructor() {
    addIcons({ close })
  }
}
