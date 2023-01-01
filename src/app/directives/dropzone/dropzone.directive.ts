import { Directive, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({
  selector: '[qbitDropzone]',
  standalone: true
})
export class DropzoneDirective {
  @Output() public dropped = new EventEmitter<FileList>()
  @Output() public hovered = new EventEmitter<boolean>()

  @HostListener('drop', ['$event'])
  public onDrop($event: DragEvent): void {
    $event.preventDefault()
    this.dropped.emit($event.dataTransfer?.files)
    this.hovered.emit(false)
  }

  @HostListener('dragover', ['$event'])
  public onDragOver($event: DragEvent): void {
    $event.preventDefault()
    this.hovered.emit(true)
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave($event: DragEvent): void {
    $event.preventDefault()
    this.hovered.emit(false)
  }
}
