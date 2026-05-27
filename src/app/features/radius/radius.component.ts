import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Preset { name: string; values: [number, number, number, number]; }

@Component({
  selector: 'app-radius',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './radius.component.html',
  styleUrl: './radius.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadiusComponent {
  readonly tl = signal(12);
  readonly tr = signal(12);
  readonly br = signal(12);
  readonly bl = signal(12);
  readonly linked = signal(true);
  readonly width = signal(200);
  readonly height = signal(200);
  readonly copied = signal(false);

  readonly presets: Preset[] = [
    { name: 'Pill', values: [100, 100, 100, 100] },
    { name: 'Circle', values: [50, 50, 50, 50] },
    { name: 'Squircle', values: [24, 24, 24, 24] },
    { name: 'Card', values: [12, 12, 12, 12] },
    { name: 'None', values: [0, 0, 0, 0] },
  ];

  readonly cssValue = computed(() => {
    const [t, r, b, l] = [this.tl(), this.tr(), this.br(), this.bl()];
    if (t === r && r === b && b === l) return `border-radius: ${t}px;`;
    return `border-radius: ${t}px ${r}px ${b}px ${l}px;`;
  });

  setCorner(corner: 'tl' | 'tr' | 'br' | 'bl', value: number): void {
    if (this.linked()) {
      this.tl.set(value); this.tr.set(value); this.br.set(value); this.bl.set(value);
    } else {
      this[corner].set(value);
    }
  }

  applyPreset(p: Preset): void {
    this.tl.set(p.values[0]); this.tr.set(p.values[1]);
    this.br.set(p.values[2]); this.bl.set(p.values[3]);
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.cssValue());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
