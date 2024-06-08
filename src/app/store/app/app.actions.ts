import { EnrollmentApplication } from '@models/application'
import { Profile } from '@models/profile'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'
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
    'Create Player': props<{ token: string }>(),
    'Create Player Success': props<{ profile: Profile }>(),
    'Create Player Failure': props<{ error: Error }>(),
    'Get Profile': props<{ id: string }>(),
    'Get Profile Success': props<{ profile: Profile }>(),
    'Get Profile Failure': props<{ error: Error }>(),
    'Create Profile': emptyProps(),
    'Create Profile Success': props<{ profile: Profile }>(),
    'Create Profile Failure': props<{ error: Error }>(),
    'Link Minecraft Account': emptyProps(),
    Logout: emptyProps(),
    'Logout Done': emptyProps(),
    'Submitted Application': props<{ application: Required<EnrollmentApplication> }>(),
    'Get Leaderboards': emptyProps(),
    'Get Leaderboards Success': props<{ leaderboards: Leaderboards }>(),
    'Get Leaderboards Failure': props<{ error: Error }>(),
    'Get Supporters': emptyProps(),
    'Get Supporters Success': props<{ supporters: MinecraftProfile[] }>(),
    'Get Supporters Failure': props<{ error: Error }>(),
    'Get Servers': emptyProps(),
    'Get Servers Success': props<{ servers: Server[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Navigate to Nickname Editor': emptyProps(),
    'Set Unsaved Changes': props<{ changes: boolean }>(),
    'Navigate Back': emptyProps(),
    'Update Nickname': props<{ nickname: string }>(),
    'Update Nickname Success': props<{ profile: Profile }>(),
    'Update Nickname Failure': props<{ error: Error }>()
  }
})
