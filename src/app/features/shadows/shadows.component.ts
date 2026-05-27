import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const PRESETS: Record<string, Shadow[]> = {
  Subtle: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.1, inset: false }],
  Medium: [{ offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 0.15, inset: false }],
  Large: [{ offsetX: 0, offsetY: 12, blur: 40, spread: 0, color: '#000000', opacity: 0.2, inset: false }],
  Brutal: [{ offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: '#000000', opacity: 1, inset: false }],
};

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

@Component({
  selector: 'app-shadows',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shadows.component.html',
  styleUrl: './shadows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShadowsComponent {
  readonly shadows = signal<Shadow[]>([
    { offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 0.15, inset: false },
  ]);
  readonly copied = signal(false);
  readonly presetNames = Object.keys(PRESETS);

  readonly cssValue = computed(() =>
    this.shadows().map(s => {
      const parts = [
        ...(s.inset ? ['inset'] : []),
        `${s.offsetX}px`,
        `${s.offsetY}px`,
        `${s.blur}px`,
        `${s.spread}px`,
        hexToRgba(s.color, s.opacity),
      ];
      return parts.join(' ');
    }).join(',\n    ')
  );

  readonly cssOutput = computed(() => `box-shadow: ${this.cssValue()};`);

  addShadow(): void {
    this.shadows.update(s => [...s, { offsetX: 0, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 0.2, inset: false }]);
  }

  removeShadow(i: number): void {
    if (this.shadows().length > 1) this.shadows.update(s => s.filter((_, idx) => idx !== i));
  }

  updateShadow(i: number, field: keyof Shadow, value: string | number | boolean): void {
    this.shadows.update(s => s.map((sh, idx) => idx === i ? { ...sh, [field]: value } : sh));
  }

  applyPreset(name: string): void {
    const preset = PRESETS[name];
    if (preset) this.shadows.set(preset.map(s => ({ ...s })));
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.cssOutput());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
