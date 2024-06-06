import { Pipe, PipeTransform } from '@angular/core'
import { USER_LABEL, UserLabel } from '@models/user'

@Pipe({
  name: 'roleColor',
  standalone: true
})
export class RoleColorPipe implements PipeTransform {
  public transform(role: UserLabel): unknown {
    switch (role) {
      case USER_LABEL.ADMIN:
        return 'danger'
      case USER_LABEL.MOD:
        return 'success'
      case USER_LABEL.QBITOR:
        return 'primary'
      case USER_LABEL.SUPPORTER:
        return 'warning'
      default:
        return 'medium'
    }
  }
}
