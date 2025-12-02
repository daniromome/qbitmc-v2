import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms'
import { FormFrom } from '../../utils/form-from'
import { EnrollmentApplication } from '@qbitmc/common'
import { REGEXP } from '@constants/regexp'
import { FileUploaderComponent } from '@components/file-uploader'
import { Store } from '@ngrx/store'
import { applicationActions } from '@store/application'
import { BytesPipe } from '@pipes/bytes'
import { ENROLLMENT_MAX_UPLOAD_SIZE } from '@constants/index'
import { AvatarPipe } from '@pipes/avatar'
import { appActions, appFeature } from '@store/app'
import { MEDIA_ENTITY } from '@models/media'
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
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonList,
  IonSpinner,
  IonToast,
  IonFooter
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { cubeOutline, cubeSharp, logOutOutline, copyOutline } from 'ionicons/icons'
import { toSignal } from '@angular/core/rxjs-interop'
import { mediaActions, mediaFeature } from '@store/media'
import { ClipboardService } from '@services/clipboard/clipboard.service'
import { ID } from 'appwrite'
import { ImageContainerComponent } from '@components/image-container'

interface ApplicationForm extends FormFrom<Omit<EnrollmentApplication, 'age' | 'media' | 'profile'>> {
  age: FormControl<string>
}

@Component({
  selector: 'qbit-join',
  standalone: true,
  imports: [
    IonFooter,
    IonToast,
    IonSpinner,
    IonList,
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
    ReactiveFormsModule,
    FormsModule,
    FileUploaderComponent,
    BytesPipe,
    AvatarPipe,
    ImageContainerComponent
  ],
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly store = inject(Store)
  public readonly clipboard = inject(ClipboardService)

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
    age: this.fb.control('', [Validators.required]),
    experience: this.fb.control('', [Validators.required]),
    reasons: this.fb.control('', [Validators.required]),
    rules: this.fb.control(false, [Validators.requiredTrue])
  })

  public readonly verification = this.fb.control<string>('')

  private readonly formChanges = toSignal(this.form.valueChanges)

  public readonly profile = this.store.selectSignal(appFeature.selectProfile)
  public readonly player = this.store.selectSignal(appFeature.selectPlayer)
  public readonly verificationLoading = this.store.selectSignal(appFeature.selectLoadingVerification)
  public readonly verificationError = this.store.selectSignal(appFeature.selectErrorVerification)

  public readonly media = this.store.selectSignal(mediaFeature.selectEntityMedia(MEDIA_ENTITY.APPLICATIONS))
  public readonly filesSize = this.store.selectSignal(mediaFeature.selectEntityMediaSize(MEDIA_ENTITY.APPLICATIONS))

  public readonly filesSizeWithinLimit = computed(() => {
    const filesSize = this.filesSize()
    return filesSize <= ENROLLMENT_MAX_UPLOAD_SIZE
  })

  public readonly filesSizeExceedsLimit = computed(() => !this.filesSizeWithinLimit())

  public constructor() {
    addIcons({ copyOutline, logOutOutline, cubeOutline, cubeSharp })
    effect(() => {
      const form = this.formChanges()
      if (!form) return
      localStorage.setItem('application', JSON.stringify(form))
    })
    effect(() => {
      const verifying = this.verificationLoading()
      if (verifying) this.verification.disable()
      else this.verification.enable()
    })
  }

  public ngOnInit(): void {
    this.store.dispatch(mediaActions.getMedia({ request: { entity: MEDIA_ENTITY.APPLICATIONS, ids: [] } }))
    const applicationString = localStorage.getItem('application')
    const applicationFromStorage = applicationString ? (JSON.parse(applicationString) as EnrollmentApplication) : undefined
    if (!applicationFromStorage) return
    const { age, experience, reasons, rules } = applicationFromStorage
    this.form.setValue({ age: age.toString(), experience, reasons, rules })
  }

  public numbersOnly(control: FormControl<string>, max: number): void {
    const val = Array.from(control.value.toString())
      .filter(v => REGEXP.DIGITS_ONLY.test(v))
      .slice(0, max)
      .join('')
    control.setValue(val)
  }

  public verificationCodeChange(): void {
    this.numbersOnly(this.verification, 6)
    const code = this.verification.getRawValue()
    if (code.length !== 6) return
    this.verification.reset()
    this.store.dispatch(appActions.minecraftAccountVerification({ code: Number(code) }))
  }

  public droppedFiles(files: File[]): void {
    const profile = this.profile()
    if (!profile) return
    const request = {
      entity: MEDIA_ENTITY.APPLICATIONS,
      files,
      maxUploadSize: ENROLLMENT_MAX_UPLOAD_SIZE,
      fileIds: Array.from(Array(files.length)).map(() => ID.unique()),
      ids: []
    }
    this.store.dispatch(mediaActions.uploadMediaResources({ request }))
  }

  public deleteImage(id: string): void {
    const profile = this.profile()
    if (!profile) return
    this.store.dispatch(mediaActions.deleteMediaResource({ request: { entity: MEDIA_ENTITY.APPLICATIONS, id } }))
  }

  public submit(): void {
    const profile = this.profile()
    if (!profile) return
    const application = this.form.getRawValue()
    const media = this.media().map(m => m.$id) || []
    this.store.dispatch(
      applicationActions.submit({ application: { ...application, age: Number(application.age), media, profile: profile.$id } })
    )
  }

  public dismissError(): void {
    this.store.dispatch(appActions.dismissError({ key: 'verification' }))
  }

  public logout(): void {
    this.store.dispatch(appActions.logout())
  }
}
