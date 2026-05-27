import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Palette { name: string; swatches: string[]; }

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsComponent {
  readonly baseColor = signal('#6c3afd');
  readonly copiedKey = signal<string | null>(null);

  readonly palettes = computed<Palette[]>(() => {
    const [h, s, l] = hexToHsl(this.baseColor());
    return [
      { name: 'Complementary', swatches: [h, h + 36, h + 90, h + 135, h + 180].map(hue => hslToHex(hue, s, l)) },
      { name: 'Analogous', swatches: [h - 30, h - 15, h, h + 15, h + 30].map(hue => hslToHex(hue, s, l)) },
      { name: 'Triadic', swatches: [h, h + 60, h + 120, h + 180, h + 240].map(hue => hslToHex(hue, s, l)) },
      { name: 'Monochromatic', swatches: [20, 35, 50, 65, 80].map(lv => hslToHex(h, s, lv)) },
    ];
  });

  readonly exportCode = computed(() => {
    const vars = this.palettes().flatMap(p =>
      p.swatches.map((hex, i) => `  --${p.name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}: ${hex};`)
    );
    return `:root {\n${vars.join('\n')}\n}`;
  });

  async copySwatch(paletteIndex: number, swatchIndex: number): Promise<void> {
    const hex = this.palettes()[paletteIndex].swatches[swatchIndex];
    await navigator.clipboard.writeText(hex);
    const key = `${paletteIndex}-${swatchIndex}`;
    this.copiedKey.set(key);
    setTimeout(() => { if (this.copiedKey() === key) this.copiedKey.set(null); }, 2000);
  }

  async copyExport(): Promise<void> {
    await navigator.clipboard.writeText(this.exportCode());
    this.copiedKey.set('export');
    setTimeout(() => { if (this.copiedKey() === 'export') this.copiedKey.set(null); }, 2000);
  }

  isCopied(paletteIndex: number, swatchIndex: number): boolean {
    return this.copiedKey() === `${paletteIndex}-${swatchIndex}`;
  }
}
