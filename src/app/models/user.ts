import { Preferences, UserLabel } from '@qbitmc/common'
import { Models } from 'appwrite'

export interface User extends Omit<Models.User<Preferences>, 'labels'> {
  labels: UserLabel[]
}
