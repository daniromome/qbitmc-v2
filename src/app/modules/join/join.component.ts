import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, effect, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { FormFrom } from '../../utils/form-from'
import { EnrollmentApplication } from '@models/application'
import { REGEXP } from '@constants/regexp'
import { NoteComponent } from '@components/note'
import { FileUploaderComponent } from '@components/file-uploader'
import { Store } from '@ngrx/store'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { ApplicationActions, applicationFeature } from '@store/application'
import { BytesPipe } from '@pipes/bytes'
import { MAX_UPLOAD_SIZE } from '@constants/index'
import { AvatarPipe } from '@pipes/avatar'
import { appActions, appFeature } from '@store/app'
import { Media } from '@models/media'
import {
  IonHeader,
  IonRow,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonCard,
  IonAvatar,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonIcon,
  IonCardContent,
  IonChip,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonList
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { cubeOutline, cubeSharp, close } from 'ionicons/icons'
import { toSignal } from '@angular/core/rxjs-interop'

interface ApplicationForm extends FormFrom<Omit<EnrollmentApplication, 'id'>> {}

interface SafeMedia extends Omit<Media, 'blob'> {
  blob?: SafeUrl
}

@Component({
  selector: 'qbit-join',
  standalone: true,
  imports: [IonList,
    IonChip,
    IonCardContent,
    IonIcon,
    IonButton,
    IonText,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonAvatar,
    IonCard,
    IonCol,
    IonGrid,
    IonContent,
    IonTextarea,
    IonTitle,
    IonToolbar,
    IonRow,
    IonInput,
    IonHeader,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NoteComponent,
    FileUploaderComponent,
    BytesPipe,
    AvatarPipe
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly store = inject(Store)
  private readonly sanitizer = inject(DomSanitizer)

  public readonly rules = [
    $localize`:@@rule-a:Be respectful toward other members of the community, any verbal abuse or sign of harassment will be sanctioned accordingly`,
    $localize`:@@rule-b:Take care of the environment in the server (not leaving floating trees, when chopping trees down placing saplings on the
    area and repairing creeper holes)`,
    $localize`:@@rule-c:Have common sense. We trust your ability to make a good judgement about the actions you take and know you're capable of
    identifying what's good from what its not`,
    $localize`:@@rule-d:Avoid any kind of political arguments that may be controversial or hurtful toward other people, at least within out community
    chats and the minecraft server`
  ]

  public readonly form: FormGroup<ApplicationForm> = this.fb.group({
    forename: this.fb.control('', [Validators.required, Validators.maxLength(12)]),
    age: this.fb.control(0, [Validators.required]),
    experience: this.fb.control('', [Validators.required]),
    reasons: this.fb.control('', [Validators.required]),
    rules: this.fb.control(false, [Validators.requiredTrue])
  })

  private readonly formChanges = toSignal(this.form.valueChanges)

  public readonly profile = this.store.selectSignal(appFeature.selectProfile)

  public readonly media: Signal<SafeMedia[]> = computed(() => {
    const media = this.store.selectSignal(applicationFeature.selectApplicationMedia)()
    return media.map(m => ({ ...m, blob: m.blob ? this.sanitizer.bypassSecurityTrustUrl(m.blob) : undefined }))
  })

  public readonly filesSize = this.store.selectSignal(applicationFeature.selectApplicationMediaSize)

  public readonly filesSizeWithinLimit = computed(() => {
    const filesSize = this.filesSize()
    return filesSize <= MAX_UPLOAD_SIZE
  })

  public readonly filesSizeExceedsLimit = computed(() => !this.filesSizeWithinLimit())

  public constructor() {
    addIcons({ cubeOutline, cubeSharp, close })
    effect(() => {
      const form = this.formChanges()
      if (!form) return
      localStorage.setItem('application', JSON.stringify(form))
    })
  }

  public ngOnInit(): void {
    this.store.dispatch(ApplicationActions.getMedia())
    const applicationString = localStorage.getItem('application')
    const application = applicationString ? JSON.parse(applicationString) : undefined
    if (!application) return
    this.form.setValue(application)
  }

  public numbersOnly(): void {
    const age = Array.from(this.form.controls.age.value.toString()).filter(v => REGEXP.DIGITS_ONLY.test(v)).slice(0, 2).join('')
    this.form.controls.age.setValue(Number(age))
  }

  public linkMinecraftAccount(): void {
    this.store.dispatch(appActions.linkMinecraftAccount())
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
