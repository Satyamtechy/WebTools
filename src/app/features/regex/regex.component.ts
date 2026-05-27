import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MatchResult {
  value: string;
  index: number;
}

interface Preset {
  name: string;
  pattern: string;
}

const PRESETS: Preset[] = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*' },
  { name: 'Phone', pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
  { name: 'Date', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
];

@Component({
  selector: 'app-regex',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './regex.component.html',
  styleUrl: './regex.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexComponent {
  readonly pattern = signal('');
  readonly testString = signal('');
  readonly flagG = signal(true);
  readonly flagI = signal(false);
  readonly flagM = signal(false);
  readonly flagS = signal(false);
  readonly presets = PRESETS;

  readonly error = computed<string>(() => {
    if (!this.pattern()) return '';
    try {
      new RegExp(this.pattern(), this.flags());
      return '';
    } catch (e) {
      return (e as Error).message;
    }
  });

  readonly matches = computed<MatchResult[]>(() => {
    if (!this.pattern() || !this.testString() || this.error()) return [];
    const re = new RegExp(this.pattern(), this.flags());
    const results: MatchResult[] = [];
    if (re.global) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(this.testString())) !== null) {
        results.push({ value: m[0], index: m.index });
        if (!m[0].length) re.lastIndex++;
      }
    } else {
      const m = re.exec(this.testString());
      if (m) results.push({ value: m[0], index: m.index });
    }
    return results;
  });

  readonly highlighted = computed<string>(() => {
    const text = this.testString();
    if (!text || !this.matches().length) return this.escapeHtml(text);
    const sorted = [...this.matches()].sort((a, b) => a.index - b.index);
    let result = '';
    let lastEnd = 0;
    for (const m of sorted) {
      result += this.escapeHtml(text.slice(lastEnd, m.index));
      result += `<mark>${this.escapeHtml(m.value)}</mark>`;
      lastEnd = m.index + m.value.length;
    }
    result += this.escapeHtml(text.slice(lastEnd));
    return result;
  });

  applyPreset(preset: Preset): void {
    this.pattern.set(preset.pattern);
  }

  private flags(): string {
    return (this.flagG() ? 'g' : '') + (this.flagI() ? 'i' : '') + (this.flagM() ? 'm' : '') + (this.flagS() ? 's' : '');
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
