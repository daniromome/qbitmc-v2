import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '@models/role';
import { StyledText, TextStyle } from '@models/styled-text';

@Pipe({
  name: 'styledRole',
  standalone: true
})
export class StyledRolePipe implements PipeTransform {
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
    },
  }

  transform(roles: Role[]): StyledText[] {
    const text = Array.from(Array(3)).map(() => ({ ...this.defaultStyle }));
    text[0].content = '['
    text[2].content = '] '
    text[1].content = 'Qbitor'
    text[1].style = { colors: ['#5555FF', '#55FFFF'], style: TextStyle.GRADIENT }
    if (roles.some(r => r === 'admin')) {
      text[1].content = 'Admin'
      text[1].style = { colors: ['#FF5555', '#55FFFF'], style: TextStyle.GRADIENT }
      return text;
    }
    if (roles.some(r => r === 'mod')) {
      text[1].content = 'Mod'
      text[1].style = { colors: ['#00AA00', '#55FF55'], style: TextStyle.GRADIENT }
      return text;
    }
    if (roles.some(r => r === 'supporter')) {
      const plus = { ...this.defaultStyle }
      plus.content = '+'
      plus.style = { color: '#FFAA00', style: TextStyle.COLOR }
      text.splice(2, 0, plus)
    }
    return text;
  }

}
