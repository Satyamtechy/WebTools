import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface JsonStats {
  keys: number;
  depth: number;
  bytes: number;
}

function countKeys(val: unknown, depth = 0): { keys: number; depth: number } {
  if (val === null || typeof val !== 'object') return { keys: 0, depth };
  const entries = Array.isArray(val) ? val : Object.values(val);
  const ownKeys = Array.isArray(val) ? 0 : Object.keys(val).length;
  let maxDepth = depth + 1;
  let childKeys = 0;
  for (const v of entries) {
    const r = countKeys(v, depth + 1);
    childKeys += r.keys;
    if (r.depth > maxDepth) maxDepth = r.depth;
  }
  return { keys: ownKeys + childKeys, depth: maxDepth };
}

@Component({
  selector: 'app-json',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './json.component.html',
  styleUrl: './json.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonComponent {
  readonly input = signal('');
  readonly mode = signal<'format' | 'minify' | 'validate'>('format');
  readonly copied = signal(false);

  readonly result = computed<{ output: string; error: string; stats: JsonStats | null }>(() => {
    const raw = this.input();
    if (!raw.trim()) return { output: '', error: '', stats: null };
    try {
      const parsed: unknown = JSON.parse(raw);
      const m = this.mode();
      const output = m === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      const { keys, depth } = countKeys(parsed);
      return {
        output: m === 'validate' ? 'Valid JSON ✓' : output,
        error: '',
        stats: { keys, depth, bytes: new TextEncoder().encode(raw).length },
      };
    } catch (e) {
      return { output: '', error: (e as Error).message, stats: null };
    }
  });

  format(): void { this.mode.set('format'); }
  minify(): void { this.mode.set('minify'); }
  validate(): void { this.mode.set('validate'); }

  async copy(): Promise<void> {
    const text = this.result().output;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
