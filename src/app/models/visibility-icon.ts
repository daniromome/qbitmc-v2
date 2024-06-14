import { VISIBILITY, Visibility } from '@qbitmc/common'

export const VISIBILITY_ICON: Record<Visibility, string> = {
  [VISIBILITY.DRAFT]: 'create',
  [VISIBILITY.PRIVATE]: 'lock-closed',
  [VISIBILITY.PUBLIC]: 'earth',
  [VISIBILITY.RESTRICTED]: 'ban',
  [VISIBILITY.UNLISTED]: 'eye-off'
} as const
