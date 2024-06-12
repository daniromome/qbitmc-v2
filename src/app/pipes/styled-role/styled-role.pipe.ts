import { TitleCasePipe } from '@angular/common'
import { Pipe, PipeTransform, inject } from '@angular/core'
import { USER_LABEL, UserLabel } from '@qbitmc/common'
import { StyledText, TextStyle } from '@models/styled-text'

@Pipe({
  name: 'styledRole',
  standalone: true
})
export class StyledRolePipe implements PipeTransform {
  private titleCase = inject(TitleCasePipe)

  private defaultStyle: StyledText = {
    content: '',
    bold: false,
    strikethrough: false,
    underline: false,
    italic: false,
    obfuscated: false,
    style: {
      color: '#AAAAAA',
      style: TextStyle.COLOR
    }
  }

  public transform(roles: UserLabel[]): StyledText[] {
    const text = Array.from(Array(3)).map(() => ({ ...this.defaultStyle }))
    text[0].content = '['
    text[2].content = '] '
    text[1].content = this.titleCase.transform(USER_LABEL.QBITOR)
    text[1].style = { colors: ['#5555FF', '#55FFFF'], style: TextStyle.GRADIENT }
    if (roles.some(r => r === USER_LABEL.ADMIN)) {
      text[1].content = this.titleCase.transform(USER_LABEL.ADMIN)
      text[1].style = { colors: ['#FF5555', '#55FFFF'], style: TextStyle.GRADIENT }
      return text
    }
    if (roles.some(r => r === USER_LABEL.MOD)) {
      text[1].content = this.titleCase.transform(USER_LABEL.MOD)
      text[1].style = { colors: ['#00AA00', '#55FF55'], style: TextStyle.GRADIENT }
      return text
    }
    if (roles.some(r => r === USER_LABEL.SUPPORTER)) {
      const plus = { ...this.defaultStyle }
      plus.content = '+'
      plus.style = { color: '#FFAA00', style: TextStyle.COLOR }
      text.splice(2, 0, plus)
    }
    return text
  }
}
