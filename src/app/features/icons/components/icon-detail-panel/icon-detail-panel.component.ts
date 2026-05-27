import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  computed,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { IconData } from '@shared/models/api.models';

@Component({
  selector: 'app-icon-detail-panel',
  standalone: true,
  imports: [ClipboardModule],
  templateUrl: './icon-detail-panel.component.html',
  styleUrl: './icon-detail-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconDetailPanelComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly clipboard = inject(Clipboard);

  readonly icon = input.required<IconData>();
  readonly color = input<string>('#000000');
  readonly strokeWidth = input<number>(2);
  readonly closed = output<void>();

  readonly copiedLabel = signal<string | null>(null);

  readonly previewSvg = computed<SafeHtml>(() => {
    const i = this.icon();
    let svg = i.svg;
    svg = svg.replace(/\bwidth="[^"]*"/, 'width="120"');
    svg = svg.replace(/\bheight="[^"]*"/, 'height="120"');
    svg = svg.replace(/\bstroke-width="[^"]*"/, `stroke-width="${this.strokeWidth()}"`);
    svg = svg.replace(/\bstroke="[^"]*"/, `stroke="${this.color()}"`);
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  readonly svgCode = computed<string>(() => this.icon().svg);

  readonly jsxCode = computed<string>(() => {
    return this.icon()
      .svg.replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule');
  });

  onBackdropClick(): void {
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }

  copyToClipboard(text: string, label: string): void {
    this.clipboard.copy(text);
    this.copiedLabel.set(label);
    setTimeout(() => this.copiedLabel.set(null), 2000);
  }
}
