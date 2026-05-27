import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-svg-optimizer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './svg-optimizer.component.html',
  styleUrl: './svg-optimizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgOptimizerComponent {
  readonly input = signal('');
  readonly copied = signal(false);

  readonly optimized = computed(() => this.input() ? this.optimize(this.input()) : '');

  readonly originalSize = computed(() => new Blob([this.input()]).size);
  readonly optimizedSize = computed(() => new Blob([this.optimized()]).size);
  readonly savings = computed(() => {
    const orig = this.originalSize();
    return orig ? Math.round((1 - this.optimizedSize() / orig) * 100) : 0;
  });

  private optimize(svg: string): string {
    let s = svg;
    // Remove XML declaration
    s = s.replace(/<\?xml[^?]*\?>\s*/gi, '');
    // Remove comments
    s = s.replace(/<!--[\s\S]*?-->/g, '');
    // Remove metadata tags
    s = s.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    // Remove empty groups
    s = s.replace(/<g[^>]*>\s*<\/g>/gi, '');
    // Remove default fill="none" when stroke is set
    s = s.replace(/(<[^>]*stroke="[^"]+")[^>]*\sfill="none"/gi, '$1');
    // Remove empty attributes (attr="")
    s = s.replace(/\s+\w+=""/g, '');
    // Collapse whitespace between tags
    s = s.replace(/>\s+</g, '><');
    // Collapse multiple spaces within tags
    s = s.replace(/\s{2,}/g, ' ');
    return s.trim();
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.optimized());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
