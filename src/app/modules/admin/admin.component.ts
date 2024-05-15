import { Component } from '@angular/core';
import { IonContent, IonRouterOutlet, IonItem, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  selector: 'qbit-admin',
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonItem, IonRouterOutlet, IonContent, ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
