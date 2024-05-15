import { Component } from '@angular/core';
import { IonContent, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [IonItem, IonContent],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent {

}
