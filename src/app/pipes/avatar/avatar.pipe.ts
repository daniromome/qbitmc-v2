import { Pipe, PipeTransform } from '@angular/core'

type AvatarType = 'face' | 'head' | 'body'

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {
  public transform(value: string, type: AvatarType = 'head', scale: number = 16): string {
    const url = new URL(`https://api.mineatar.io/${this.getURI(type)}/${value}`)
    url.searchParams.append('scale', scale.toString())
    return value ? url.toString() : ''
  }

  private getURI(type: AvatarType): string {
    if (type === 'body') return 'body/full'
    return type
  }
}
