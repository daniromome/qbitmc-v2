import { Pipe, PipeTransform } from '@angular/core'
import { USER_LABEL, UserLabel } from '@qbitmc/common'

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  public transform(role: UserLabel): unknown {
    switch (role) {
      case USER_LABEL.SUPPORTER:
        return 'qbitor+'
      case USER_LABEL.GUEST:
        return $localize`:@@guest:guest`
      default:
        return role
    }
  }
}
