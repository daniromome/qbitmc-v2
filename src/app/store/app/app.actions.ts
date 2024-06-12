import { Profile, ServerDocument, PlayerDocument } from '@qbitmc/common'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Leaderboards } from '@models/leaderboards'
import { Models } from 'appwrite'
import { User } from '@models/user'

export const appActions = createActionGroup({
  source: 'App',
  events: {
    Initialize: emptyProps(),
    'Get Session': emptyProps(),
    'Get Session Success': props<{ session: Models.Session }>(),
    'Get Session Failure': props<{ error: Error }>(),
    'Get User': emptyProps(),
    'Get User Success': props<{ user: User }>(),
    'Get User Failure': props<{ error: Error }>(),
    Login: emptyProps(),
    'Get Profile': props<{ id: string }>(),
    'Get Profile Success': props<{ profile: Profile }>(),
    'Get Profile Failure': props<{ error: Error }>(),
    'Create Profile': emptyProps(),
    'Create Profile Success': props<{ profile: Profile }>(),
    'Create Profile Failure': props<{ error: Error }>(),
    'Minecraft Account Verification': props<{ code: number }>(),
    'Minecraft Account Verification Success': props<{ player: PlayerDocument }>(),
    'Minecraft Account Verification Failure': props<{ error: Error }>(),
    Logout: emptyProps(),
    'Logout Done': emptyProps(),
    'Get Leaderboards': emptyProps(),
    'Get Leaderboards Success': props<{ leaderboards: Leaderboards }>(),
    'Get Leaderboards Failure': props<{ error: Error }>(),
    'Get Supporters': emptyProps(),
    'Get Supporters Success': props<{ supporters: PlayerDocument[] }>(),
    'Get Supporters Failure': props<{ error: Error }>(),
    'Get Servers': emptyProps(),
    'Get Servers Success': props<{ servers: ServerDocument[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Navigate to Nickname Editor': emptyProps(),
    'Set Unsaved Changes': props<{ changes: boolean }>(),
    'Navigate Back': emptyProps(),
    'Update Nickname': props<{ nickname: string }>(),
    'Update Nickname Success': props<{ user: User }>(),
    'Update Nickname Failure': props<{ error: Error }>(),
    'Dismiss Error': props<{ key: string }>()
  }
})
