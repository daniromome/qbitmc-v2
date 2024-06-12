import { CommonModule } from '@angular/common'
import { Component, OnInit, computed, effect, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { adminActions, adminFeature } from '@store/admin'
import { appFeature } from '@store/app'
import { selectRouteParam } from '@store/router'
import {
  IonList,
  IonContent,
  IonItem,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonButton
} from '@ionic/angular/standalone'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { FileUploaderComponent } from '@components/file-uploader'
import { FormFrom } from '@utils'
import { Server, VISIBILITY, Visibility } from '@qbitmc/common'
import { addIcons } from 'ionicons'
import { lockClosed, earth, ban, eyeOff } from 'ionicons/icons'

@Component({
  selector: 'qbit-server-form',
  standalone: true,
  imports: [
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonCard,
    IonIcon,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
    IonInput,
    IonItem,
    IonContent,
    IonList,
    CommonModule,
    FileUploaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './server-form.component.html',
  styleUrl: './server-form.component.scss'
})
export class ServerFormComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly id = this.store.selectSignal(selectRouteParam('id'))
  private readonly servers = computed(() => {
    const id = this.id()
    if (!id) return undefined
    const unregisteredServer = this.store.selectSignal(adminFeature.selectServer(id))()
    const registeredServer = this.store.selectSignal(appFeature.selectServer(id))()
    return [registeredServer, unregisteredServer]
  })
  public readonly visibility = [
    { value: VISIBILITY.PRIVATE, icon: 'lock-closed' },
    { value: VISIBILITY.PUBLIC, icon: 'earth' },
    { value: VISIBILITY.RESTRICTED, icon: 'ban' },
    { value: VISIBILITY.UNLISTED, icon: 'eye-off' }
  ]
  public readonly isServerRegistered = computed(() => {
    const servers = this.servers()
    if (!servers) return undefined
    const [registeredServer] = servers
    return !!registeredServer
  })
  public readonly server = computed(() => {
    const servers = this.servers()
    if (!servers) return undefined
    const [registeredServer, unregisteredServer] = servers
    return registeredServer || unregisteredServer
  })
  public readonly form: FormGroup<FormFrom<Server>> = this.fb.group({
    description: this.fb.control(''),
    game: this.fb.control('', [Validators.required]),
    media: this.fb.array<string>([]),
    ip: this.fb.control(''),
    loader: this.fb.control('', [Validators.required]),
    name: this.fb.control(''),
    version: this.fb.control('', [Validators.required]),
    visibility: this.fb.control<Visibility>(VISIBILITY.PUBLIC)
  })

  public constructor() {
    addIcons({ lockClosed, earth, ban, eyeOff })
    effect(() => {
      const server = this.server()
      if (!server) return
      Object.entries(server)
        .filter(([_k, v]) => !!v)
        .forEach(([k, v]) => {
          const key = k as keyof Server
          this.form.controls[key].setValue(v)
        })
    })
  }

  public ngOnInit(): void {
    if (this.server()) return
    this.store.dispatch(adminActions.getServers())
  }

  public upsertServer(): void {
    this.store.dispatch(adminActions.upsertServer({ server: this.form.getRawValue() }))
  }
}
