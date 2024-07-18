import { CommonModule } from '@angular/common'
import { Component, OnInit, computed, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { serverActions, serverFeature } from '@store/server'
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
import { mediaFeature } from '@store/media'
import { ImageContainerComponent } from '@components/image-container'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { debounceTime, exhaustMap, filter, first, tap } from 'rxjs'

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
  public readonly visibility = [
    { value: VISIBILITY.PRIVATE, icon: 'lock-closed' },
    { value: VISIBILITY.PUBLIC, icon: 'earth' },
    { value: VISIBILITY.RESTRICTED, icon: 'ban' },
    { value: VISIBILITY.UNLISTED, icon: 'eye-off' },
    { value: VISIBILITY.DRAFT, icon: 'create' }
  ]
  private readonly server$ = this.store
    .select(selectRouteParam('id'))
    .pipe(exhaustMap(id => this.store.select(serverFeature.selectServer(id!))))
  public readonly server = toSignal(this.server$)
  public readonly form: FormGroup<FormFrom<Omit<Server, 'media'>>> = this.fb.group({
    description: this.fb.control(''),
    game: this.fb.control('', [Validators.required]),
    ip: this.fb.control(''),
    name: this.fb.control(''),
    version: this.fb.control('', [Validators.required]),
    visibility: this.fb.control<Visibility>(VISIBILITY.DRAFT)
  })
  public readonly changes$ = this.form.valueChanges.pipe(
    debounceTime(3000),
    filter(() => this.server()?.visibility === VISIBILITY.DRAFT),
    tap(() => {
      this.store.dispatch(
        serverActions.updateServer({
          $id: this.server()!.$id,
          server: { ...this.form.getRawValue(), visibility: VISIBILITY.DRAFT }
        })
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
    this.server$
      .pipe(
        filter(server => !!server),
        first(),
        tap(server => {
          Object.entries(server!)
            .filter(([k, v]) => Object.keys(this.form.getRawValue()).includes(k) && !!v)
            .forEach(([k, v]) => {
              const key = k as keyof Omit<Server, 'media'>
              this.form.controls[key].setValue(v, { emitEvent: false })
            })
        }),
        takeUntilDestroyed()
      )
      .subscribe()
  }

  public ngOnInit(): void {
    this.changes$.subscribe()
    if (this.server()) return
    this.store.dispatch(serverActions.getServers({ includeDrafts: true }))
  }

  public updateServer(): void {
    const server = this.server()
    if (!server) return
    this.store.dispatch(
      serverActions.updateServer({
        $id: server.$id,
        server: { ...this.form.getRawValue() }
      })
    )
  }

  public droppedFiles(files: File[]): void {
    const server = this.server()
    if (!server) return
    const request = {
      entity: MEDIA_ENTITY.SERVER,
      files,
      fileIds: Array.from(Array(files.length)).map(() => ID.unique()),
      ids: []
    }
    this.store.dispatch(serverActions.addMediaToServer({ request, server }))
  }

  public deleteImage(id: string): void {
    const server = this.server()
    if (!server) return
    this.store.dispatch(
      serverActions.deleteMediaFromServer({
        request: {
          entity: MEDIA_ENTITY.SERVER,
          id
        },
        server
      })
    )
  }
}
