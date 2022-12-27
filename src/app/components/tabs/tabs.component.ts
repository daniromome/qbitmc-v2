import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'qbit-tabs',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tabs.component.html'
})
export class TabsComponent {
  public readonly tabs = [
    {
      icon: 'home',
      label: $localize`Home`,
      path: 'home'
    }
  ]
}