import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { DropzoneDirective } from '@directives/dropzone'
import { Platform, IonRippleEffect, IonIcon, IonText, IonButton, IonAlert } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { download, cloudUpload } from 'ionicons/icons'

type FileType = 'image' | 'any'
@Component({
  selector: 'qbit-file-uploader',
  standalone: true,
  imports: [IonAlert, IonButton, IonText, IonIcon, IonRippleEffect, CommonModule, DropzoneDirective],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploaderComponent {
  private readonly platform = inject(Platform)
  public readonly max = input(0)
  public readonly label = input($localize`:@@image-upload-dropzone-label:Drag and drop file(s) to upload`)
  public readonly type = input<FileType>('any')
  public readonly droppedFiles = output<File[]>()
  public readonly isHovering = signal(false)
  public readonly desktop = signal(this.platform.is('desktop'))
  public readonly fileList: WritableSignal<FileList | undefined> = signal(undefined)
  private uploaded: Signal<File[]> = computed(() => {
    const fileLimit = this.max()
    const fileList = this.fileList()
    if (!fileList) return []
    if (fileLimit === 1 && fileList.length === 1) {
      const file = fileList.item(0)
      if (file && this.validFileType(file)) return [file]
    }
    return Array.from(Array(fileList.length).keys())
      .map(i => fileList.item(i) as File)
      .filter(file => file && this.validFileType(file))
  })

  public readonly isFilesLimitExceeded = computed(() => {
    const fileLimit = this.max()
    const fileList = this.fileList()
    if (!fileList) return false
    return fileLimit && fileList.length > fileLimit
  })

  public constructor() {
    addIcons({ download, cloudUpload })
    effect(() => {
      const files = this.uploaded()
      if (files.length === 0) return
      this.droppedFiles.emit(files)
    })
  }

  public onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files
    if (files) this.fileList.set(files)
  }

  private validFileType(file: File): boolean {
    const type = this.type()
    if (type === 'any') return true
    return file.type.split('/')[0] === type
  }
}
