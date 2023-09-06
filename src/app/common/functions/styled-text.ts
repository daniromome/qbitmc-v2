import { ColorTextStyle, GradientTextStyle, RainbowTextStyle, StyledText, TextStyle } from '@models/styled-text'
import { Style } from '../../models/styled-text'

const parseStyleTag = (text: string): ColorTextStyle | RainbowTextStyle | GradientTextStyle | undefined => {
  const attributes = text.split(':')
  const tag = attributes.shift()
  switch (tag) {
    case 'color':
      return { color: attributes.at(-1), style: TextStyle.COLOR } as ColorTextStyle
    case 'rainbow': {
      const [frequency, saturation, offset] = attributes.map(Number)
      return { frequency, saturation, offset, style: TextStyle.RAINBOW } as RainbowTextStyle
    }
    case 'gradient':
      return { colors: attributes, style: TextStyle.GRADIENT } as GradientTextStyle
    default:
      return undefined
  }
}

export const parseUnstyledText = (text: string): StyledText => {
  const attributes: { [k: string]: boolean } = {
    bold: false,
    strikethrough: false,
    underline: false,
    italic: false,
    obfuscated: false
  }
  const tags = text.split('>')
  const content = tags.pop()?.trim()
  const styleIndex = tags.findIndex(s => s.includes(':'))
  const styleString = styleIndex !== -1 ? tags.splice(styleIndex, 1)[0] : undefined
  tags.forEach(name => { attributes[name] = true })
  const style = styleString ? parseStyleTag(styleString) : undefined
  return { ...attributes, content, style } as StyledText
}

const stringifyStyle = (style: Style): string => {
  switch (style.style) {
    case TextStyle.COLOR: return `<${style.style}:${style.color}>`
    case TextStyle.GRADIENT: return `<${style.style}:${style.colors.join(':')}>`
    case TextStyle.RAINBOW: return `<${style.style}:${style.frequency}:${style.saturation}:${style.offset}>`
  }
}

export const stringifyStyledText = (text: StyledText): string => {
  return Object.entries(text).filter(([_, value]) => !!value).map(([key, value]) => {
    if (typeof value === 'boolean') return `<${key}>`
    if (typeof value === 'object') return stringifyStyle(value)
    return `${value}`
  }).reverse().join('')
}
