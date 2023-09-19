import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { FormFrom } from '../../utils/form-from'
import { EnrollmentApplication } from '@models/application'
import { Observable, map, Subject } from 'rxjs'
import { REGEXP } from '@constants/regexp'
import { NoteComponent } from '@components/note'
import { FileUploaderComponent } from '@components/file-uploader'
import { Store } from '@ngrx/store'
import { takeUntil } from 'rxjs/operators'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ApplicationActions, applicationFeature } from '@store/application'
import { BytesPipe } from '@pipes/bytes'
import { MAX_UPLOAD_SIZE } from '@constants/index'
import { Profile } from '@models/profile'
import { AvatarPipe } from '@pipes/avatar'
import { AppActions, appFeature } from '@store/app'
import { Media } from '@models/media'

interface ApplicationForm extends FormFrom<Omit<EnrollmentApplication, 'id'>> {}

interface SafeMedia extends Omit<Media, 'blob'> {
  blob?: SafeUrl
}

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
    BytesPipe,
    AvatarPipe
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinComponent implements OnInit, OnDestroy {
  public readonly rules = [
    $localize`:@@rule-a:Be respectful toward other members of the community, any verbal abuse or sign of harassment will be sanctioned accordingly`,
    $localize`:@@rule-b:Take care of the environment in the server (not leaving floating trees, when chopping trees down placing saplings on the
    area and repairing creeper holes)`,
    $localize`:@@rule-c:Have common sense. We trust your ability to make a good judgement about the actions you take and know you're capable of
    identifying what's good from what its not`,
    $localize`:@@rule-d:Avoid any kind of political arguments that may be controversial or hurtful toward other people, at least within out community
    chats and the minecraft server`
  ]

  public readonly form: FormGroup<ApplicationForm>
  public readonly profile$: Observable<Profile | undefined>
  public readonly media$: Observable<SafeMedia[]>
  public readonly filesSize$: Observable<number>
  public readonly filesSizeWithinLimit$: Observable<boolean>
  public readonly filesSizeExceedsLimit$: Observable<boolean>
  private readonly watchFormChanges: Subject<void>

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly store: Store,
    private readonly sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      forename: this.fb.control('', [Validators.required, Validators.maxLength(12)]),
      age: this.fb.control(0, [Validators.required]),
      experience: this.fb.control('', [Validators.required]),
      reasons: this.fb.control('', [Validators.required]),
      rules: this.fb.control(false, [Validators.requiredTrue])
    })
    this.profile$ = this.store.select(appFeature.selectProfile)
    this.media$ = this.store.select(applicationFeature.selectApplicationMedia).pipe(
      map(media => media.map(m => ({ ...m, blob: m.blob ? this.sanitizer.bypassSecurityTrustUrl(m.blob) : undefined })))
    )
    this.filesSize$ = this.store.select(applicationFeature.selectApplicationMediaSize)
    this.filesSizeWithinLimit$ = this.filesSize$.pipe(
      map(size => size <= MAX_UPLOAD_SIZE)
    )
    this.filesSizeExceedsLimit$ = this.filesSizeWithinLimit$.pipe(
      map(bool => !bool)
    )
    this.watchFormChanges = new Subject()
    this.form.valueChanges.pipe(
      takeUntil(this.watchFormChanges)
    ).subscribe(value => {
      localStorage.setItem('application', JSON.stringify(value))
    })
  }

  public ngOnInit(): void {
    this.store.dispatch(ApplicationActions.getMedia())
    const applicationString = localStorage.getItem('application')
    const application = applicationString ? JSON.parse(applicationString) : undefined
    if (!application) return
    this.form.setValue(application)
    Object.keys(this.form.controls).forEach(k => {
      if (application[k]) this.form.get(k)?.markAsDirty()
    })
  }

  public ngOnDestroy(): void {
    this.watchFormChanges.next()
    this.watchFormChanges.complete()
  }

  public numbersOnly(): void {
    const age = Array.from(this.form.controls.age.value.toString()).filter(v => REGEXP.DIGITS_ONLY.test(v)).slice(0, 2).join('')
    this.form.controls.age.setValue(
      Number(age)
    )
  }

  public linkMinecraftAccount(): void {
    this.store.dispatch(AppActions.linkMinecraftAccount())
  }

  public droppedFiles(files: File[]): void {
    this.store.dispatch(ApplicationActions.uploadMediaResources({ files }))
  }

  public deleteImage(key: string): void {
    this.store.dispatch(ApplicationActions.deleteMediaResource({ key }))
  }

  public submit(): void {
    this.store.dispatch(ApplicationActions.submit({ application: { ...this.form.getRawValue() } }))
  }
}
