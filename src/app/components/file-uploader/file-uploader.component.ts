import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DropzoneDirective } from '@directives/dropzone'
import { IonicModule, AlertController, Platform } from '@ionic/angular'
import { from } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'qbit-file-uploader',
  standalone: true,
  imports: [CommonModule, DropzoneDirective, IonicModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
  @Input() public max = 0
  @Input() public label = $localize`Drag and drop file(s) to upload`
  @Input() public type?: 'image' | 'any' = 'any'
  @Output() public droppedFiles: EventEmitter<File[]> = new EventEmitter()
  public isHovering = false
  public desktop: boolean
  private files: File[] = []
  private uploaded: File[] = []

  public constructor(
    private readonly alert: AlertController,
    private readonly platform: Platform
  ) {
    this.desktop = this.platform.is('desktop')
  }

  public toggleHover(event: boolean): void {
    this.isHovering = event
  }

  public onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files
    if (files) this.onDrop(files)
  }

  public openPicker(input: HTMLInputElement): void {
    setTimeout(() => {
      input.click()
    }, 1)
  }

  public onDrop(files: FileList): void {
    this.uploaded.splice(0, this.uploaded.length)
    if (this.max && files.length > this.max) {
      from(this.alert.create({
        header: $localize`:@@errorTitle:Error`,
        message: $localize`You can upload a maximum of ${this.max} file(s) at a time`
      })).pipe(switchMap(alert => from(alert.present()))).subscribe()
    } else if (this.max === 1 && files.length === 1) {
      const file = files.item(0)
      if (file && this.validFileType(file)) {
        this.droppedFiles.emit([file])
      }
    } else {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (file && this.validFileType(file)) {
          this.files.push(file)
          this.uploaded.push(file)
        }
      }
      if (this.files.length > 0) this.droppedFiles.emit(this.uploaded)
    }
  }

  private validFileType(file: File): boolean {
    if (this.type === 'any') return true
    const valid = file.type.split('/')[0] === this.type
    if (valid) return valid
    from(this.alert.create({
      header: $localize`:@@errorTitle:Error`,
      message: $localize`The type of file "${file?.name}" is not allowed. Try uploading it in the following format "${this.type}"`
    })).pipe(switchMap(alert => from(alert.present()))).subscribe()
    return valid
  }
}
