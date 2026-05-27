import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface FileInfo {
  name: string;
  type: string;
  size: number;
}

@Component({
  selector: 'app-image-base64',
  standalone: true,
  imports: [],
  templateUrl: './image-base64.component.html',
  styleUrls: ['./image-base64.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageBase64Component {
  fileInfo = signal<FileInfo | null>(null);
  preview = signal('');
  base64 = signal('');
  dataUri = signal('');
  copiedBase64 = signal(false);
  copiedDataUri = signal(false);
  dragging = signal(false);

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) this.processFile(file);
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  copy(type: 'base64' | 'dataUri'): void {
    const text = type === 'base64' ? this.base64() : this.dataUri();
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'base64') {
        this.copiedBase64.set(true);
        setTimeout(() => this.copiedBase64.set(false), 1500);
      } else {
        this.copiedDataUri.set(true);
        setTimeout(() => this.copiedDataUri.set(false), 1500);
      }
    });
  }

  private processFile(file: File): void {
    this.fileInfo.set({ name: file.name, type: file.type, size: file.size });
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.dataUri.set(result);
      this.base64.set(result.split(',')[1]);
      this.preview.set(result);
    };
    reader.readAsDataURL(file);
  }
}
