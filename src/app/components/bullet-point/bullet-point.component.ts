import { Component } from '@angular/core'
import { IonGrid, IonCol, IonRow } from '@ionic/angular/standalone'

@Component({
  selector: 'qbit-bullet-point',
  standalone: true,
  imports: [IonRow, IonCol, IonGrid],
  templateUrl: './bullet-point.component.html',
  styleUrl: './bullet-point.component.scss'
})
export class BulletPointComponent {

}
