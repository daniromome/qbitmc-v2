import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'qbit-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent{
  @Input() public elementsInView = 0
  @Input() public elementsCount = 0
  public get slideWidth() {
    return `${100 / this.elementsInView}dvw`
  }
  public get slideAnimationSpeed() {
    switch (this.elementsInView) {
      case 1: return '40s'
      case 2: return '30s'
      case 3: return '30s'
      case 4: return '35s'
      default: return '45s'
    }
  }
}
