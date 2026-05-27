import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
}

const PRESETS: DevicePreset[] = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

@Component({
  selector: 'app-responsive-tester',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './responsive-tester.component.html',
  styleUrl: './responsive-tester.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveTesterComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly presets = PRESETS;
  readonly url = signal('');
  readonly loadedUrl = signal('');
  readonly width = signal(1366);
  readonly height = signal(768);
  readonly zoom = signal(0.75);
  readonly activePreset = signal('Laptop');
  readonly iframeError = signal(false);

  readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    const u = this.loadedUrl();
    return u ? this.sanitizer.bypassSecurityTrustResourceUrl(u) : null;
  });

  selectPreset(preset: DevicePreset): void {
    this.width.set(preset.width);
    this.height.set(preset.height);
    this.activePreset.set(preset.name);
  }

  rotate(): void {
    const w = this.width();
    this.width.set(this.height());
    this.height.set(w);
    this.activePreset.set('');
  }

  loadUrl(): void {
    if (!this.url()) return;
    let u = this.url();
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    this.url.set(u);
    this.iframeError.set(false);
    this.loadedUrl.set(u);
  }

  onIframeError(): void {
    this.iframeError.set(true);
  }
}
