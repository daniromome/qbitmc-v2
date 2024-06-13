import { CommonModule } from '@angular/common'
import { Component, OnInit, computed, effect, inject } from '@angular/core'
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
  IonGrid
} from '@ionic/angular/standalone'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { FileUploaderComponent } from '@components/file-uploader'
import { FormFrom } from '@utils'
import { Server, VISIBILITY, Visibility } from '@qbitmc/common'
import { addIcons } from 'ionicons'
import { lockClosed, earth, ban, eyeOff, close, create } from 'ionicons/icons'
import { MEDIA_ENTITY } from '@models/media'
import { ID } from 'appwrite'
import { mediaActions, mediaFeature } from '@store/media'
import { ImageContainerComponent } from '@components/image-container'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, filter, skip, switchMap, tap } from 'rxjs'
import { concatLatestFrom } from '@ngrx/operators'

@Component({
  selector: 'qbit-server-form',
  standalone: true,
  imports: [
    IonGrid,
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
    { value: VISIBILITY.UNLISTED, icon: 'eye-off' },
    { value: VISIBILITY.DRAFT, icon: 'create' }
  ]
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
    name: this.fb.control(''),
    version: this.fb.control('', [Validators.required]),
    visibility: this.fb.control<Visibility>(VISIBILITY.DRAFT)
  })
  public readonly changes$ = this.form.valueChanges.pipe(
    debounceTime(3000),
    skip(1),
    concatLatestFrom(() =>
      this.store.select(selectRouteParam('id')).pipe(switchMap(id => this.store.select(serverFeature.selectServer(id!))))
    ),
    filter(([_, server]) => !!server && server.visibility === VISIBILITY.DRAFT),
    tap(([_, server]) => {
      this.store.dispatch(
        serverActions.updateServer({ id: server!.$id, server: { ...this.form.getRawValue(), visibility: VISIBILITY.DRAFT } })
      )
    }),
    takeUntilDestroyed()
  )
  public readonly media = computed(() => {
    const server = this.server()
    if (!server) return []
    return this.store.selectSignal(mediaFeature.selectMedia(server.media))()
  })

  public constructor() {
    addIcons({ lockClosed, earth, ban, eyeOff, close, create })
    effect(() => {
      const server = this.server()
      if (!server) return
      Object.entries(server)
        .filter(([k, v]) => Object.keys(this.form.getRawValue()).includes(k) && !!v)
        .forEach(([k, v]) => {
          if (k === 'media' && Array.isArray(v)) {
            v.forEach(id => this.form.controls.media.push(this.fb.control<string>(id)))
          }
          const key = k as keyof Server
          this.form.controls[key].setValue(v)
        })
    })
  }

  public ngOnInit(): void {
    this.changes$.subscribe()
    if (this.server()) return
    this.store.dispatch(serverActions.getServers())
  }

  public updateServer(): void {
    const id = this.id()
    if (!id) return
    this.store.dispatch(serverActions.updateServer({ id, server: this.form.getRawValue() }))
  }

  public droppedFiles(files: File[]): void {
    const request = {
      entity: MEDIA_ENTITY.SERVER,
      files,
      fileIds: Array.from(Array(files.length)).map(() => ID.unique()),
      ids: []
    }
    request.fileIds.forEach(id => this.form.controls.media.push(this.fb.control(id)))
    this.store.dispatch(mediaActions.uploadMediaResources({ request }))
  }

  public deleteImage(id: string): void {
    const index = this.form.controls.media.value.findIndex(m => m === id)
    if (index !== -1) this.form.controls.media.removeAt(index)
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
