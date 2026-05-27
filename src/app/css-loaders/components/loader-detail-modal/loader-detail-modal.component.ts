import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CssFormatPipe } from '../../pipes/css-format.pipe';

@Component({
  selector: 'app-loader-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './loader-detail-modal.component.html',
  styleUrl: './loader-detail-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderDetailModalComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cssFormatPipe = new CssFormatPipe();

  readonly html = input.required<string>();
  readonly css = input.required<string>();
  readonly loaderId = input.required<string>();
  readonly closed = output<void>();

  readonly activeFormat = signal<'css' | 'scss' | 'tailwind'>('css');
  readonly copyFeedback = signal('');

  readonly safePreview = computed(() => {
    const scoped = this.css().replaceAll('.loader', `.loader-modal-${this.loaderId()}`);
    const scopedHtml = this.html().replace('class="loader"', `class="loader-modal-${this.loaderId()}"`);
    return this.sanitizer.bypassSecurityTrustHtml(`<style>${scoped}</style>${scopedHtml}`);
  });

  readonly formattedCss = computed(() =>
    this.cssFormatPipe.transform(this.css(), this.activeFormat())
  );

  setFormat(fmt: 'css' | 'scss' | 'tailwind'): void {
    this.activeFormat.set(fmt);
  }

  async copyCss(): Promise<void> {
    await navigator.clipboard.writeText(this.formattedCss());
    this.showFeedback('CSS copied!');
  }

  async copyHtml(): Promise<void> {
    await navigator.clipboard.writeText(this.html());
    this.showFeedback('HTML copied!');
  }

  close(): void {
    this.closed.emit();
  }

  private showFeedback(msg: string): void {
    this.copyFeedback.set(msg);
    setTimeout(() => this.copyFeedback.set(''), 2000);
  }
}
