import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Language = 'HTML' | 'CSS' | 'JavaScript' | 'TypeScript' | 'JSON';

@Component({
  selector: 'app-code-formatter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './code-formatter.component.html',
  styleUrl: './code-formatter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeFormatterComponent {
  readonly languages: Language[] = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'JSON'];
  readonly selectedLanguage = signal<Language>('JSON');
  readonly code = signal('');
  readonly output = signal('');
  readonly copied = signal(false);

  format(): void {
    const input = this.code();
    if (!input.trim()) return;
    switch (this.selectedLanguage()) {
      case 'JSON': this.output.set(this.formatJson(input)); break;
      case 'HTML': this.output.set(this.formatHtml(input)); break;
      case 'CSS': this.output.set(this.formatCss(input)); break;
      case 'JavaScript':
      case 'TypeScript': this.output.set(this.formatJs(input)); break;
    }
  }

  minify(): void {
    const input = this.code();
    if (!input.trim()) return;
    this.output.set(input.replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ').trim());
  }

  async copy(): Promise<void> {
    if (!this.output()) return;
    await navigator.clipboard.writeText(this.output());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  private formatJson(input: string): string {
    try {
      return JSON.stringify(JSON.parse(input), null, 2);
    } catch {
      return '// Invalid JSON';
    }
  }

  private formatHtml(input: string): string {
    let indent = 0;
    const lines: string[] = [];
    const tokens = input.replace(/>\s*</g, '>\n<').split('\n');
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + trimmed);
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.match(/^<(img|br|hr|input|meta|link)/i)) {
        indent++;
      }
    }
    return lines.join('\n');
  }

  private formatCss(input: string): string {
    return input
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\n\s*\n/g, '\n')
      .replace(/  \n}/g, '\n}')
      .trim();
  }

  private formatJs(input: string): string {
    let indent = 0;
    const lines: string[] = [];
    const raw = input.replace(/([{])/g, '$1\n').replace(/([}])/g, '\n$1').replace(/;/g, ';\n').split('\n');
    for (const line of raw) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + trimmed);
      if (trimmed.endsWith('{')) indent++;
    }
    return lines.join('\n');
  }
}
