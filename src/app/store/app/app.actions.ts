import { EnrollmentApplication } from '@models/application'
import { KeycloakToken, Profile } from '@models/profile'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'

export const appActions = createActionGroup({
  source: 'App',
  events: {
    Initialize: emptyProps(),
    Login: emptyProps(),
    'Get Profile': emptyProps(),
    'Get Profile Success': props<{ profile: Profile }>(),
    'Get Profile Failure': props<{ error: Error }>(),
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
    'Update Nickname Failure': props<{ error: Error }>(),
    'Set Access Token': props<{ token: KeycloakToken }>(),
    'Refresh Access Token': props<{ token: KeycloakToken }>()
  }
})
