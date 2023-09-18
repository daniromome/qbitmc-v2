import { FormGroup, FormControl } from '@angular/forms'
import { FormFrom } from '../utils/form-from'

export enum TextStyle {
  GRADIENT = 'gradient',
  RAINBOW = 'rainbow',
  COLOR = 'color'
}
export interface GradientTextStyle {
  colors: string[]
  style: TextStyle.GRADIENT
}

export interface RainbowTextStyle {
  frequency: number
  saturation: number
  offset: number
  style: TextStyle.RAINBOW
}

export interface ColorTextStyle {
  color: string
  style: TextStyle.COLOR
}

export type Style = GradientTextStyle | RainbowTextStyle | ColorTextStyle

export interface StyledText {
  content: string
  bold: boolean
  strikethrough: boolean
  underline: boolean
  italic: boolean
  obfuscated: boolean
  style?: Style
}

export interface StyledTextForm extends FormGroup<{
  attributes: FormGroup<FormFrom<Omit<StyledText, 'style'>>>
  style: FormControl<TextStyle | undefined>
  color: FormGroup<FormFrom<Omit<ColorTextStyle, 'style'>>>
  gradient: FormGroup<FormFrom<Omit<GradientTextStyle, 'style'>>>
  rainbow: FormGroup<FormFrom<Omit<RainbowTextStyle, 'style'>>>
}> {}
