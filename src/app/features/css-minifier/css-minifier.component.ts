import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-css-minifier',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './css-minifier.component.html',
  styleUrl: './css-minifier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CssMinifierComponent {
  readonly input = signal('');
  readonly output = signal('');
  readonly copied = signal(false);

  readonly originalSize = computed(() => new Blob([this.input()]).size);
  readonly outputSize = computed(() => new Blob([this.output()]).size);
  readonly savings = computed(() => {
    const orig = this.originalSize();
    return orig ? Math.round((1 - this.outputSize() / orig) * 100) : 0;
  });

  minify(): void {
    const css = this.input();
    const result = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    this.output.set(result);
  }

  beautify(): void {
    const css = this.input();
    const minified = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
    let result = '';
    let indent = 0;
    for (let i = 0; i < minified.length; i++) {
      const ch = minified[i];
      if (ch === '{') {
        result += ' {\n' + '  '.repeat(++indent);
      } else if (ch === '}') {
        result = result.trimEnd() + '\n' + '  '.repeat(--indent) + '}\n' + '  '.repeat(indent);
      } else if (ch === ';') {
        result += ';\n' + '  '.repeat(indent);
      } else if (ch === ':' && minified[i + 1] !== ' ') {
        result += ': ';
      } else {
        result += ch;
      }
    }
    this.output.set(result.trim());
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.output());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
