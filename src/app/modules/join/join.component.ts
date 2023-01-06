import { ChangeDetectionStrategy, Component, isDevMode, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { IonicModule, LoadingController, AlertController } from '@ionic/angular'
import { FormFrom } from '../../common/types/forms'
import { Application } from '@models/application'
import { Observable, map, scheduled, asapScheduler, firstValueFrom, filter, BehaviorSubject, Subscription } from 'rxjs'
import { MinecraftService } from '@services/minecraft'
import { REGEXP } from '@constants/regexp'
import { NoteComponent } from '@components/note'
import { FileUploaderComponent } from '@components/file-uploader'
import { SupabaseService } from '@services/supabase'
import { Store } from '@ngrx/store'
import { selectProfileId } from '@selectors/app'
import { debounceTime, switchMap } from 'rxjs/operators'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { PreferencesService } from '@services/preferences'
import { ApplicationActions, ApplicationStoreModule } from '@store/application'
import { BytesPipe } from '@pipes/bytes'
import { MAX_UPLOAD_SIZE } from '@constants/index'

interface ApplicationForm extends FormFrom<Omit<Application, 'uuid'>> {}

interface SupabaseFile { name: string, file: SafeUrl, size: number }

@Component({
  selector: 'qbit-join',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    NoteComponent,
    FileUploaderComponent,
    ApplicationStoreModule,
    BytesPipe
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinComponent implements OnInit, OnDestroy {
  public readonly rules = [
    $localize`Be respectful toward other members of the community, any verbal abuse or sign of harassment will be sanctioned accordingly`,
    $localize`Take care of the environment in the server (not leaving floating trees, when chopping trees down placing saplings on the
    area and repairing creeper holes)`,
    $localize`Have common sense. We trust your ability to make a good judgement about the actions you take and know you're capable of
    identifying what's good from what its not.`,
    $localize`Avoid any kind of political arguments that may be controversial or hurtful toward other people, at least within out community
    chats and the minecraft server`
  ]

  public readonly form: FormGroup<ApplicationForm>
  public readonly avatar$: Observable<string>
  public readonly files$: Observable<SupabaseFile[]>
  public readonly filesSize$: Observable<number>
  public readonly filesSizeWithinLimit$: Observable<boolean>
  public readonly filesSizeExceedsLimit$: Observable<boolean>
  private readonly uuid$: Observable<string>
  private readonly _files: BehaviorSubject<SupabaseFile[]>
  private readonly bucket: string
  private readonly sub: Subscription
  private profile?: string

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly mc: MinecraftService,
    private readonly supabase: SupabaseService,
    private readonly store: Store,
    private readonly sanitizer: DomSanitizer,
    private readonly loading: LoadingController,
    private readonly alert: AlertController,
    private readonly preferences: PreferencesService
  ) {
    this.form = this.fb.group({
      profile: this.fb.control(''),
      nickname: this.fb.control('', [Validators.required]),
      age: this.fb.control(0, [Validators.required, Validators.min(16)]),
      experience: this.fb.control('', [Validators.required]),
      ign: this.fb.control('', [Validators.required]),
      reasons: this.fb.control('', [Validators.required]),
      rules: this.fb.control(false, [Validators.requiredTrue])
    })
    this.uuid$ = isDevMode()
      ? scheduled(['77655fb282e7493f839c22870f3fcec9'], asapScheduler)
      : this.form.controls.ign.valueChanges.pipe(
        debounceTime(300),
        switchMap(ign => this.mc.getUUID(ign)),
        map(minecraftProfile => minecraftProfile.id)
      )
    this.avatar$ = this.uuid$.pipe(
      map(uuid => this.mc.getAvatar(uuid))
    )
    this._files = new BehaviorSubject<SupabaseFile[]>([])
    this.files$ = this._files.asObservable()
    this.filesSize$ = this.files$.pipe(
      map(files => files?.reduce((accumulator, value) => accumulator + value.size, 0) ?? 0)
    )
    this.filesSizeWithinLimit$ = this.filesSize$.pipe(
      map(size => size <= MAX_UPLOAD_SIZE)
    )
    this.filesSizeExceedsLimit$ = this.filesSizeWithinLimit$.pipe(
      map(bool => !bool)
    )
    this.bucket = 'applications'
    this.sub = this.form.valueChanges.pipe(
      switchMap(value => this.preferences.set('application', JSON.stringify(value)))
    ).subscribe()
  }

  public async ngOnInit(): Promise<void> {
    const applicationString = await firstValueFrom(this.preferences.get('application'))
    const application = applicationString ? JSON.parse(applicationString) : undefined
    this.profile = (await firstValueFrom(this.store.select(selectProfileId).pipe(filter(p => !!p)))) as string
    if (application?.profile === this.profile) {
      this.form.setValue(application)
      Object.keys(this.form.controls).forEach(k => {
        if (k === 'profile') return
        if (application[k]) this.form.get(k)?.markAsDirty()
      })
    } else this.form.controls.profile.setValue(this.profile)
    await this.getFiles()
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  public numbersOnly(): void {
    const age = Array.from(this.form.controls.age.value.toString()).filter(v => REGEXP.DIGITS_ONLY.test(v)).slice(0, 2).join('')
    this.form.controls.age.setValue(
      Number(age)
    )
  }

  public async droppedFiles(files: File[]): Promise<void> {
    const loader = await this.loading.create()
    await loader.present()
    await (async(): Promise<void> => {
      const response = await Promise.all(
        files.map(f => this.supabase.storage.from(this.bucket).upload(
          `${this.profile}/${crypto.randomUUID()}.${f.name.split('.').at(-1)}`,
          f
        ))
      )
      const errors = response.filter(r => r.error)
      if (errors.length > 0) throw errors.length
      await this.getFiles()
    })()
      .catch(error => this.alert.create({
        header: $localize`:@@errorTitle:Error`,
        message: $localize`There was an error uploading ${error} of your files`
      }).then(alert => alert.present()))
      .finally(() => this.loading.dismiss())
  }

  public async deleteImage(name: string, files: SupabaseFile[]): Promise<void> {
    const loader = await this.loading.create()
    await loader.present()
    await (async(): Promise<void> => {
      const index = files.findIndex(f => f.name === name)
      if (index === -1) throw new Error('Not found')
      const { error } = await this.supabase.storage.from(this.bucket).remove([`${this.profile}/${name}`])
      if (error) throw error
      files.splice(index, 1)
      this._files.next(files)
    })()
      .catch(() => this.alert.create({
        header: $localize`:@@errorTitle:Error`,
        message: $localize`There was an error deleting the file`
      }).then(alert => alert.present()))
      .finally(() => this.loading.dismiss())
  }

  public async submit(): Promise<void> {
    const loader = await this.loading.create()
    await loader.present()
    await (async(): Promise<void> => {
      const [files, withinLimit] = await Promise.all([await firstValueFrom(this.files$), await firstValueFrom(this.filesSizeWithinLimit$)])
      if (files.length === 0) throw new Error($localize`You need to attach at least one image`)
      if (!withinLimit) throw new Error($localize`The maximum upload size is 7.5MiB`)
      const form = this.form.getRawValue()
      const uuid = await firstValueFrom(this.uuid$)
      this.store.dispatch(ApplicationActions.submit({ application: { ...form, uuid } }))
    })()
      .catch((error) => this.alert.create({
        header: $localize`:@@errorTitle:Error`,
        message: error.message
      }).then(alert => alert.present()))
      .finally(() => this.loading.dismiss())
  }

  private async getFiles(): Promise<void> {
    const files = await this.supabase.storage.from(this.bucket).list(this.profile)
    if (!files.data || files.error) throw files.error || new Error('No data')
    const response = await Promise.all(
      files.data.map(file => this.supabase.storage.from(this.bucket).download(`${this.profile}/${file.name}`))
    )
    this._files.next(response.filter(blob => blob.data && !blob.error).map((blob, i) => {
      const url = URL.createObjectURL(blob.data as Blob)
      // eslint-disable-next-line dot-notation
      return { name: files.data[i].name, file: this.sanitizer.bypassSecurityTrustUrl(url), size: files.data[i].metadata['size'] }
    }))
  }
}
