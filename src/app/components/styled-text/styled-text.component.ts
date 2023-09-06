import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StyledText, TextStyle } from '@models/styled-text'

@Component({
  selector: 'qbit-styled-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './styled-text.component.html',
  styleUrls: ['./styled-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StyledTextComponent {
  @Input() public text?: StyledText

  public get weight(): string | number {
    return this.text?.bold ? 'bold' : 400
  }

  public get style(): string {
    return this.text?.italic ? 'italic' : 'normal'
  }

  public get color(): string {
    switch (this.text?.style?.style) {
      case TextStyle.COLOR:
        return this.text?.style.color
      case TextStyle.GRADIENT:
        return `linear-gradient(90deg,${this.text.style.colors.join(',')})`
      default:
        return '#fff'
    }
  }

  public get saturation(): string {
    if (this.text?.style?.style === TextStyle.RAINBOW) return `${this.text.style.saturation * 100}%`
    return '100%'
  }
}
