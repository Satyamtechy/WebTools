import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meta-tags',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './meta-tags.component.html',
  styleUrl: './meta-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetaTagsComponent {
  readonly title = signal('');
  readonly description = signal('');
  readonly keywords = signal('');
  readonly author = signal('');
  readonly canonicalUrl = signal('');
  readonly ogImage = signal('');
  readonly twitterCard = signal<'summary' | 'summary_large_image'>('summary_large_image');
  readonly copied = signal(false);

  readonly output = computed(() => {
    const t = this.title();
    const d = this.description();
    const lines: string[] = [];
    if (t) lines.push(`<title>${t}</title>`);
    if (d) lines.push(`<meta name="description" content="${d}">`);
    if (this.keywords()) lines.push(`<meta name="keywords" content="${this.keywords()}">`);
    if (this.author()) lines.push(`<meta name="author" content="${this.author()}">`);
    if (this.canonicalUrl()) lines.push(`<link rel="canonical" href="${this.canonicalUrl()}">`);
    if (t) lines.push(`<meta property="og:title" content="${t}">`);
    if (d) lines.push(`<meta property="og:description" content="${d}">`);
    if (this.ogImage()) lines.push(`<meta property="og:image" content="${this.ogImage()}">`);
    if (this.canonicalUrl()) lines.push(`<meta property="og:url" content="${this.canonicalUrl()}">`);
    lines.push(`<meta name="twitter:card" content="${this.twitterCard()}">`);
    if (t) lines.push(`<meta name="twitter:title" content="${t}">`);
    if (d) lines.push(`<meta name="twitter:description" content="${d}">`);
    return lines.join('\n');
  });

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.output());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
