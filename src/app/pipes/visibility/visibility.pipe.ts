import { Pipe, PipeTransform } from '@angular/core'
import { VISIBILITY, Visibility } from '@qbitmc/common'

@Pipe({
  name: 'visibility',
  standalone: true
})
export class VisibilityPipe implements PipeTransform {
  public transform(value: Visibility): string {
    switch (value) {
      case VISIBILITY.PRIVATE:
        return $localize`:@@visibility-private:Private`
      case VISIBILITY.PUBLIC:
        return $localize`:@@visibility-public:Public`
      case VISIBILITY.RESTRICTED:
        return $localize`:@@visibility-restricted:Restricted`
      default:
        return value
    }
  }
}
