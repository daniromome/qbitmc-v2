import { CommonModule } from '@angular/common'
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core'
import { Store } from '@ngrx/store'
import { serverActions, serverFeature } from '@store/server'
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
  IonButton,
  IonRow,
  IonCol,
  IonChip,
  IonGrid
} from '@ionic/angular/standalone'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { FileUploaderComponent } from '@components/file-uploader'
import { FormFrom } from '@utils'
import { Server, VISIBILITY, Visibility } from '@qbitmc/common'
import { addIcons } from 'ionicons'
import { lockClosed, earth, ban, eyeOff, close } from 'ionicons/icons'
import { MEDIA_ENTITY } from '@models/media'
import { ID } from 'appwrite'
import { mediaActions, mediaFeature } from '@store/media'
import { ImageContainerComponent } from '@components/image-container/image-container.component'

@Component({
  selector: 'qbit-server-form',
  standalone: true,
  imports: [
    IonGrid,
    IonChip,
    IonCol,
    IonRow,
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
    ReactiveFormsModule,
    ImageContainerComponent
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
    const unregisteredServer = this.store.selectSignal(serverFeature.selectServer(id))()
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
  public readonly mediaList = signal<string[]>([])
  public readonly media = computed(() => {
    const mediaList = this.mediaList()
    return this.store.selectSignal(mediaFeature.selectMedia(mediaList))()
  })
  public readonly form: FormGroup<FormFrom<Server>> = this.fb.group({
    $id: this.fb.control(''),
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
    addIcons({ lockClosed, earth, ban, eyeOff, close })
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
    effect(() => {
      const id = this.id()
      const mediaList = this.mediaList()
      const stringifiedList = mediaList.join(',')
      if (stringifiedList === localStorage.getItem(`server-images-${id}`)) return
      localStorage.setItem(`server-images-${id}`, stringifiedList)
    })
  }

  public ionViewWillEnter(): void {
    const id = this.id()
    const mediaListString = localStorage.getItem(`server-images-${id}`)
    const mediaList = mediaListString ? mediaListString.split(',') : []
    this.mediaList.set(mediaList)
    if (mediaList.length > 0)
      this.store.dispatch(mediaActions.getMedia({ request: { entity: MEDIA_ENTITY.SERVER, ids: mediaList } }))
  }

  public ngOnInit(): void {
    if (this.server()) return
    this.store.dispatch(serverActions.getServers())
  }

  public upsertServer(): void {
    this.store.dispatch(serverActions.upsertServer({ server: this.form.getRawValue() }))
  }

  public droppedFiles(files: File[]): void {
    const request = {
      entity: MEDIA_ENTITY.SERVER,
      files,
      fileIds: Array.from(Array(files.length)).map(() => ID.unique()),
      ids: []
    }
    this.mediaList.update(value => [...value, ...request.fileIds])
    this.store.dispatch(mediaActions.uploadMediaResources({ request }))
  }

  public deleteImage(id: string): void {
    this.mediaList.update(value => {
      const index = value.findIndex(v => v === id)
      value.splice(index)
      return value
    })
    this.store.dispatch(
      mediaActions.deleteMediaResource({
        request: {
          entity: MEDIA_ENTITY.SERVER,
          id
        }
      })
    )
  }
}
