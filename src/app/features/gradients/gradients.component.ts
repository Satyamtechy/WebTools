import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ColorStop { color: string; position: number; }

@Component({
  selector: 'app-gradients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gradients.component.html',
  styleUrl: './gradients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientsComponent {
  readonly stops = signal<ColorStop[]>([
    { color: '#6c3afd', position: 0 },
    { color: '#ff6b6b', position: 100 },
  ]);
  readonly angle = signal(90);
  readonly type = signal<'linear' | 'radial' | 'conic'>('linear');
  readonly copied = signal(false);

  readonly types: ('linear' | 'radial' | 'conic')[] = ['linear', 'radial', 'conic'];
  readonly presets = ['to right', 'to bottom', 'to bottom right', '45deg', '135deg'] as const;

  readonly cssValue = computed(() => {
    const stopsStr = this.stops().map(s => `${s.color} ${s.position}%`).join(', ');
    switch (this.type()) {
      case 'linear': return `linear-gradient(${this.angle()}deg, ${stopsStr})`;
      case 'radial': return `radial-gradient(circle, ${stopsStr})`;
      case 'conic': return `conic-gradient(from ${this.angle()}deg, ${stopsStr})`;
    }
  });

  addStop(): void {
    this.stops.update(s => [...s, { color: '#ffffff', position: 50 }]);
  }

  removeStop(i: number): void {
    if (this.stops().length > 2) this.stops.update(s => s.filter((_, idx) => idx !== i));
  }

  updateStop(i: number, field: 'color' | 'position', value: string): void {
    this.stops.update(s => s.map((st, idx) => idx === i ? { ...st, [field]: field === 'position' ? +value : value } : st));
  }

  setPreset(preset: string): void {
    const match = preset.match(/(\d+)deg/);
    if (match) { this.angle.set(+match[1]); this.type.set('linear'); }
    else {
      const map: Record<string, number> = { 'to right': 90, 'to bottom': 180, 'to bottom right': 135 };
      this.angle.set(map[preset] ?? 90); this.type.set('linear');
    }
  }

  randomGradient(): void {
    const rnd = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    this.stops.set([{ color: rnd(), position: 0 }, { color: rnd(), position: 100 }]);
    this.angle.set(Math.floor(Math.random() * 360));
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(`background: ${this.cssValue()};`);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
